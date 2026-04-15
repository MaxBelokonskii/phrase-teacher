import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Wrapper around Web Speech API for English pronunciation.
 *
 * Caveats:
 * - iOS Safari requires the first speak() call to be inside a user gesture
 *   (e.g. click). We never call this on mount or via watchers.
 * - Voices may load asynchronously; we listen to `voiceschanged`.
 * - If unsupported (older browsers, in-app webviews), `isSupported` is false
 *   and the UI should hide TTS controls.
 */
export function useSpeech() {
  const settings = useSettingsStore()

  const isSupported = ref<boolean>(
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  )
  const voices = ref<SpeechSynthesisVoice[]>([])
  const isPlaying = ref(false)

  function loadVoices() {
    if (!isSupported.value) return
    voices.value = window.speechSynthesis.getVoices()
  }

  if (isSupported.value && typeof window !== 'undefined') {
    onMounted(() => {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    })
  }

  const englishVoices = computed(() =>
    voices.value.filter((v) => v.lang.startsWith('en')),
  )

  function pronounce(text: string) {
    if (!isSupported.value || !text) return
    try {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = settings.ttsRate
      const preferred = settings.ttsVoice
      if (preferred) {
        const match = voices.value.find((v) => v.name === preferred)
        if (match) utter.voice = match
      } else {
        const fallback =
          englishVoices.value.find((v) => v.name.includes('Samantha')) ||
          englishVoices.value.find((v) => v.lang === 'en-US') ||
          englishVoices.value[0]
        if (fallback) utter.voice = fallback
      }
      utter.onstart = () => (isPlaying.value = true)
      utter.onend = () => (isPlaying.value = false)
      utter.onerror = () => (isPlaying.value = false)
      window.speechSynthesis.speak(utter)
    } catch {
      isPlaying.value = false
    }
  }

  function stop() {
    if (!isSupported.value) return
    window.speechSynthesis.cancel()
    isPlaying.value = false
  }

  return { isSupported, voices, englishVoices, isPlaying, pronounce, stop }
}
