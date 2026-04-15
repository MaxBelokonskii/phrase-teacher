import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Settings, ThemeMode } from '@/types'

const STORAGE_KEY = 'pt_settings'

const DEFAULTS: Settings = {
  themeMode: 'auto',
  ttsRate: 0.85,
  ttsVoice: null,
}

export const useSettingsStore = defineStore('settings', () => {
  const stored = useLocalStorage<Settings>(STORAGE_KEY, DEFAULTS, { mergeDefaults: true })

  const themeMode = ref<ThemeMode>(stored.value.themeMode)
  const ttsRate = ref<number>(stored.value.ttsRate)
  const ttsVoice = ref<string | null>(stored.value.ttsVoice)

  watch([themeMode, ttsRate, ttsVoice], () => {
    stored.value = {
      themeMode: themeMode.value,
      ttsRate: ttsRate.value,
      ttsVoice: ttsVoice.value,
    }
  })

  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode
  }

  function setTtsRate(rate: number) {
    ttsRate.value = Math.min(1.5, Math.max(0.5, rate))
  }

  function setTtsVoice(voice: string | null) {
    ttsVoice.value = voice
  }

  function reset() {
    themeMode.value = DEFAULTS.themeMode
    ttsRate.value = DEFAULTS.ttsRate
    ttsVoice.value = DEFAULTS.ttsVoice
  }

  return {
    themeMode,
    ttsRate,
    ttsVoice,
    setThemeMode,
    setTtsRate,
    setTtsVoice,
    reset,
  }
})
