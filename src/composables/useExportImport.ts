import type { ExportData, Phrase, PhraseProgress, Settings, StreakData } from '@/types'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useSettingsStore } from '@/stores/useSettingsStore'

const EXPORT_VERSION = 1

export function useExportImport() {
  const phrasesStore = usePhrasesStore()
  const progressStore = useProgressStore()
  const settingsStore = useSettingsStore()

  function exportAll(): void {
    const payload: ExportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      userPhrases: phrasesStore.userPhrases,
      progress: progressStore.progressMap,
      streak: progressStore.streak,
      settings: {
        themeMode: settingsStore.themeMode,
        ttsRate: settingsStore.ttsRate,
        ttsVoice: settingsStore.ttsVoice,
      },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `phrase-teacher-backup-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function importFromFile(file: File): Promise<{ success: true; counts: { phrases: number } } | { success: false; error: string }> {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as Partial<ExportData>
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Файл повреждён или имеет неверный формат.' }
      }
      if (typeof data.version !== 'number' || data.version > EXPORT_VERSION) {
        return {
          success: false,
          error: `Неподдерживаемая версия данных (${String(data.version)}).`,
        }
      }

      let importedPhrases = 0
      if (Array.isArray(data.userPhrases)) {
        const valid = (data.userPhrases as Phrase[]).filter(
          (p) => p && typeof p.id === 'string' && typeof p.ru === 'string' && typeof p.en === 'string' && typeof p.category === 'string',
        )
        phrasesStore.importUserPhrases(valid)
        importedPhrases = valid.length
      }

      progressStore.importProgress({
        progress: data.progress as Record<string, PhraseProgress> | undefined,
        streak: data.streak as StreakData | undefined,
      })

      if (data.settings) {
        const s = data.settings as Settings
        if (s.themeMode === 'auto' || s.themeMode === 'light' || s.themeMode === 'dark') {
          settingsStore.setThemeMode(s.themeMode)
        }
        if (typeof s.ttsRate === 'number') settingsStore.setTtsRate(s.ttsRate)
        if (s.ttsVoice === null || typeof s.ttsVoice === 'string') {
          settingsStore.setTtsVoice(s.ttsVoice)
        }
      }

      return { success: true, counts: { phrases: importedPhrases } }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Неизвестная ошибка чтения файла.' }
    }
  }

  return { exportAll, importFromFile }
}
