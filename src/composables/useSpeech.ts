import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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

// Novelty / joke / robotic Apple voices — sound terrible, never pick automatically.
// Includes English original names and Russian-localized macOS names (en-US locale
// on a Russian system swaps voice display names to Cyrillic).
const VOICE_BLOCKLIST = [
  // English names
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'good news',
  'jester',
  'junior',
  'organ',
  'pipe organ',
  'superstar',
  'trinoid',
  'whisper',
  'wobble',
  'zarvox',
  // Russian (macOS RU locale)
  'альберт',
  'бах',
  'виолончель',
  'воббл',
  'джуниор',
  'зарвокс',
  'колокольчик',
  'орган',
  'плохие новости',
  'прыг-скок',
  'пузырьки',
  'суперзвезда',
  'триноид',
  'хорошие новости',
  'шепот',
  'шёпот',
  'шутник',
]

// Best-in-class neural/cloud voices.
const NEURAL_KEYWORDS = ['natural', 'neural', 'premium', 'enhanced']

// Microsoft Edge online neural voices.
const MS_NEURAL_NAMES = ['aria', 'jenny', 'guy', 'davis', 'sara', 'tony', 'jane', 'libby']

// Apple's well-regarded standard voices (the "default" Apple voices most users hear).
const APPLE_STANDARD = [
  // English
  'samantha',
  'daniel',
  'karen',
  'moira',
  'tessa',
  'alex',
  'ava',
  'allison',
  'susan',
  'serena',
  'evan',
  'joelle',
  'nicky',
  'tom',
  'aaron',
  'victoria',
  'vicki',
  'fiona',
  // Russian transliterations (macOS RU locale)
  'саманта',
  'дэниэл',
  'карен',
  'мойра',
  'тесса',
  'виктория',
]

// Apple compact "character" voices added in recent macOS/iOS (Sonoma+). Decent quality.
const APPLE_MODERN_COMPACT = [
  'eddy',
  'flo',
  'grandma',
  'grandpa',
  'reed',
  'rocko',
  'sandy',
  'shelley',
]

// Older Apple voices that work but sound noticeably more synthetic than the standards above.
const APPLE_OLDER = ['fred', 'ralph', 'kathy', 'фред', 'ральф', 'кэти']

function nameMatches(haystack: string, needles: readonly string[]): boolean {
  for (const n of needles) {
    if (haystack.includes(n)) return true
  }
  return false
}

interface ScoreOptions {
  /** When true, network-dependent voices get a heavy penalty (use offline mode). */
  preferLocal?: boolean
}

/**
 * Score an English voice by how human-sounding it is likely to be.
 * Returns a higher number for more natural voices. Voices on the blocklist
 * (joke/novelty Apple voices like Albert, Bahh, Cellos) get -Infinity so
 * they're never auto-selected even if no other voices are available.
 *
 * When `preferLocal` is true, voices marked as remote (`localService === false`)
 * get a strong penalty so the auto-pick falls back to a local voice. This is
 * important on Edge/Windows where "Online (Natural)" voices need internet
 * and silently fail when offline (relevant during travel without Wi-Fi).
 */
export function scoreVoice(voice: SpeechSynthesisVoice, opts: ScoreOptions = {}): number {
  const name = voice.name.toLowerCase()

  if (nameMatches(name, VOICE_BLOCKLIST)) return Number.NEGATIVE_INFINITY

  let score = 0

  // Tier 1: neural / cloud voices.
  if (nameMatches(name, NEURAL_KEYWORDS)) score += 200
  if (name.includes('online')) score += 50

  // Chrome's bundled Google voices — consistently natural across Chrome installs.
  if (name.startsWith('google')) score += 180

  // Microsoft Edge neural voices (e.g. "Microsoft Aria Online (Natural)").
  if (nameMatches(name, MS_NEURAL_NAMES)) score += 100

  // Tier 2: Apple's flagship standard voices (Samantha/Daniel/Karen/Moira/etc.).
  if (nameMatches(name, APPLE_STANDARD)) score += 90

  // Tier 3: Apple's modern compact voices (Eddy/Flo/Grandma/...).
  if (nameMatches(name, APPLE_MODERN_COMPACT)) score += 60

  // Tier 4: older Apple voices (Fred/Ralph/Kathy) — usable fallback.
  if (nameMatches(name, APPLE_OLDER)) score += 20

  // Penalize the older robotic Microsoft SAPI voices.
  if (name.includes('microsoft david')) score -= 80
  if (name.includes('microsoft mark')) score -= 80
  if (name.includes('microsoft zira')) score -= 80

  // Locale tiebreaker: prefer en-US, then en-GB.
  if (voice.lang === 'en-US') score += 5
  else if (voice.lang === 'en-GB') score += 3
  else if (voice.lang.startsWith('en')) score += 1

  // Slight tiebreaker: local voices are more reliable (no network round-trip).
  if (voice.localService) score += 8

  // Heavy penalty for remote voices when offline.
  if (opts.preferLocal && voice.localService === false) score -= 1000

  return score
}

export function useSpeech() {
  const settings = useSettingsStore()

  const isSupported = ref<boolean>(
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  )
  const voices = ref<SpeechSynthesisVoice[]>([])
  const isPlaying = ref(false)
  const isOnline = ref<boolean>(
    typeof navigator === 'undefined' ? true : navigator.onLine !== false,
  )

  function loadVoices() {
    if (!isSupported.value) return
    voices.value = window.speechSynthesis.getVoices()
  }

  function updateOnline() {
    if (typeof navigator === 'undefined') return
    isOnline.value = navigator.onLine !== false
  }

  if (isSupported.value && typeof window !== 'undefined') {
    onMounted(() => {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
      window.addEventListener('online', updateOnline)
      window.addEventListener('offline', updateOnline)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    })
  }

  const englishVoices = computed(() =>
    voices.value.filter((v) => v.lang.startsWith('en')),
  )

  /** Best available English voice ranked by `scoreVoice`. */
  const bestVoice = computed<SpeechSynthesisVoice | undefined>(() => {
    if (englishVoices.value.length === 0) return undefined
    const opts = { preferLocal: !isOnline.value }
    const ranked = [...englishVoices.value].sort(
      (a, b) => scoreVoice(b, opts) - scoreVoice(a, opts),
    )
    return ranked[0]
  })

  function pronounce(text: string) {
    if (!isSupported.value || !text) return
    try {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = settings.ttsRate
      const preferred = settings.ttsVoice
      let chosen: SpeechSynthesisVoice | undefined
      if (preferred) {
        chosen = voices.value.find((v) => v.name === preferred)
      }
      if (!chosen) chosen = bestVoice.value
      if (chosen) {
        utter.voice = chosen
        utter.lang = chosen.lang || 'en-US'
      } else {
        utter.lang = 'en-US'
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

  return { isSupported, voices, englishVoices, bestVoice, isPlaying, pronounce, stop }
}
