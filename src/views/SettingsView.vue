<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { Download, Upload, Trash2, Volume2, Sun, Moon, MonitorSmartphone } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useExportImport } from '@/composables/useExportImport'
import { useSpeech, scoreVoice } from '@/composables/useSpeech'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import type { ThemeMode } from '@/types'

const settings = useSettingsStore()
const progress = useProgressStore()
const phrases = usePhrasesStore()
const { exportAll, importFromFile } = useExportImport()
const { englishVoices, bestVoice, isSupported, pronounce } = useSpeech()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const importMessage = ref<{ kind: 'success' | 'error'; text: string } | null>(null)

const themeOptions = [
  { value: 'auto', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
] as const

const voiceOptions = computed(() => {
  // Sort English voices by quality so the most natural ones bubble to the top.
  const ranked = [...englishVoices.value].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const autoLabel = bestVoice.value
    ? `Авто — ${bestVoice.value.name} (${bestVoice.value.lang})`
    : 'Авто (системный голос)'
  return [
    { value: '', label: autoLabel },
    ...ranked.map((v) => ({
      value: v.name,
      label: `${v.name} (${v.lang})`,
    })),
  ]
})

const ttsRateLabel = computed(() => {
  const v = settings.ttsRate
  if (v <= 0.7) return 'Очень медленно'
  if (v <= 0.85) return 'Медленно'
  if (v <= 1.0) return 'Обычно'
  if (v <= 1.2) return 'Быстро'
  return 'Очень быстро'
})

function setTheme(value: string) {
  settings.setThemeMode(value as ThemeMode)
}

function setVoice(value: string) {
  settings.setTtsVoice(value || null)
}

function previewVoice() {
  pronounce('Hello! This is your pronunciation voice.')
}

function triggerImport() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  importMessage.value = null
  const result = await importFromFile(file)
  if (result.success) {
    importMessage.value = {
      kind: 'success',
      text: `Импортировано: ${result.counts.phrases} пользовательских фраз и сохранён прогресс.`,
    }
  } else {
    importMessage.value = { kind: 'error', text: result.error }
  }
  target.value = ''
}

function resetProgress() {
  if (!confirm('Сбросить прогресс и серию? Пользовательские фразы останутся.')) return
  progress.reset()
  importMessage.value = { kind: 'success', text: 'Прогресс сброшен.' }
}

function resetUserPhrases() {
  if (!confirm('Удалить все пользовательские фразы? Это нельзя отменить.')) return
  phrases.clearUserPhrases()
  importMessage.value = { kind: 'success', text: 'Пользовательские фразы удалены.' }
}

function resetAll() {
  if (!confirm('Сбросить ВСЕ данные: прогресс, серию, настройки и пользовательские фразы?')) return
  progress.reset()
  phrases.clearUserPhrases()
  settings.reset()
  importMessage.value = { kind: 'success', text: 'Все данные сброшены.' }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="heading-2 mb-1">Настройки</h1>
      <p class="text-sm text-muted">Внешний вид, голос произношения и резервные копии.</p>
    </div>

    <!-- Appearance -->
    <section class="card p-5 space-y-4">
      <h2 class="heading-3 flex items-center gap-2">
        <Sun class="w-5 h-5 text-cta-500" />
        Внешний вид
      </h2>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="opt in themeOptions"
          :key="opt.value"
          type="button"
          class="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer"
          :class="
            settings.themeMode === opt.value
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          "
          @click="setTheme(opt.value)"
        >
          <component
            :is="opt.value === 'auto' ? MonitorSmartphone : opt.value === 'dark' ? Moon : Sun"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium">{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <!-- TTS -->
    <section class="card p-5 space-y-4">
      <h2 class="heading-3 flex items-center gap-2">
        <Volume2 class="w-5 h-5 text-brand-500" />
        Произношение
      </h2>
      <p v-if="!isSupported" class="text-sm text-muted">
        Этот браузер не поддерживает Web Speech API.
      </p>
      <div v-else class="space-y-4">
        <AppSelect
          :model-value="settings.ttsVoice ?? ''"
          :options="voiceOptions"
          label="Голос"
          @update:model-value="setVoice"
        />
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Скорость: <span class="font-mono">{{ settings.ttsRate.toFixed(2) }}×</span>
            <span class="text-muted text-xs ml-2">{{ ttsRateLabel }}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            :value="settings.ttsRate"
            class="w-full accent-brand-600 cursor-pointer"
            @input="(e) => settings.setTtsRate(Number((e.target as HTMLInputElement).value))"
          />
        </div>
        <AppButton variant="secondary" size="md" @click="previewVoice">
          <Volume2 class="w-4 h-4" />
          Прослушать
        </AppButton>
      </div>
    </section>

    <!-- Backup -->
    <section class="card p-5 space-y-4">
      <h2 class="heading-3 flex items-center gap-2">
        <Download class="w-5 h-5 text-brand-500" />
        Резервная копия
      </h2>
      <p class="text-sm text-muted">
        Все фразы и прогресс хранятся локально в браузере. Сохраните копию, чтобы перенести данные на другое устройство или в другой браузер.
      </p>
      <div class="flex flex-col sm:flex-row gap-2">
        <AppButton variant="primary" size="md" @click="exportAll">
          <Download class="w-4 h-4" />
          Скачать JSON
        </AppButton>
        <AppButton variant="secondary" size="md" @click="triggerImport">
          <Upload class="w-4 h-4" />
          Загрузить JSON
        </AppButton>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="hidden"
          @change="onFileChange"
        />
      </div>
      <p
        v-if="importMessage"
        class="text-sm rounded-lg px-3 py-2"
        :class="
          importMessage.kind === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
        "
      >
        {{ importMessage.text }}
      </p>
    </section>

    <!-- Danger zone -->
    <section class="card p-5 space-y-4 border-rose-200 dark:border-rose-900/50">
      <h2 class="heading-3 flex items-center gap-2 text-rose-600 dark:text-rose-400">
        <Trash2 class="w-5 h-5" />
        Опасная зона
      </h2>
      <div class="space-y-2">
        <AppButton variant="ghost" size="md" block @click="resetProgress">
          Сбросить прогресс и серию
        </AppButton>
        <AppButton variant="ghost" size="md" block @click="resetUserPhrases">
          Удалить все мои фразы
        </AppButton>
        <AppButton variant="danger" size="md" block @click="resetAll">
          Сбросить всё
        </AppButton>
      </div>
    </section>
  </div>
</template>
