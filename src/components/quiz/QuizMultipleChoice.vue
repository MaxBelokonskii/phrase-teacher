<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, X, Volume2 } from 'lucide-vue-next'
import type { Phrase } from '@/types'
import { shuffle, pickRandom } from '@/utils/shuffle'
import { useSpeech } from '@/composables/useSpeech'

interface Props {
  phrase: Phrase
  /** All phrases that can be used as distractors (typically same category). */
  pool: Phrase[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answer: [correct: boolean]
}>()

const selected = ref<string | null>(null)
const locked = ref(false)
const { pronounce, isSupported } = useSpeech()

const options = computed<string[]>(() => {
  // Generate 4 options: correct + 3 distractors from pool (excluding current phrase).
  const distractors = props.pool
    .filter((p) => p.id !== props.phrase.id)
    .map((p) => p.en)
  const uniqueDistractors = Array.from(new Set(distractors)).filter((en) => en !== props.phrase.en)
  const picked = pickRandom(uniqueDistractors, 3)
  return shuffle([props.phrase.en, ...picked])
})

watch(
  () => props.phrase.id,
  () => {
    selected.value = null
    locked.value = false
  },
)

function isCorrect(option: string): boolean {
  return option === props.phrase.en
}

function pick(option: string) {
  if (locked.value) return
  selected.value = option
  locked.value = true
  const correct = isCorrect(option)
  if (isSupported.value && correct) {
    pronounce(props.phrase.en)
  }
  // Brief pause so user sees feedback, then advance.
  setTimeout(() => {
    emit('answer', correct)
  }, 1200)
}

function classFor(option: string): string {
  if (!locked.value) {
    return 'bg-surface-card dark:bg-surface-card-dark border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20'
  }
  if (isCorrect(option)) {
    return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-900 dark:text-emerald-100'
  }
  if (option === selected.value) {
    return 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-900 dark:text-rose-100'
  }
  return 'bg-surface-card dark:bg-surface-card-dark border-slate-200 dark:border-slate-700 opacity-60'
}
</script>

<template>
  <div class="space-y-5">
    <!-- Question -->
    <div class="card p-6 text-center">
      <p class="text-xs uppercase tracking-wider text-muted font-semibold mb-3">Переведите на английский</p>
      <p class="text-2xl md:text-3xl font-display font-semibold text-slate-900 dark:text-slate-100">
        {{ phrase.ru }}
      </p>
      <button
        v-if="locked && isSupported"
        type="button"
        class="mt-4 inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-300 hover:underline cursor-pointer"
        @click="pronounce(phrase.en)"
      >
        <Volume2 class="w-4 h-4" />
        Услышать произношение
      </button>
    </div>

    <!-- Options -->
    <div class="grid grid-cols-1 gap-2.5">
      <button
        v-for="option in options"
        :key="option"
        type="button"
        :disabled="locked"
        class="text-left p-4 rounded-2xl border-2 transition-all duration-200 ease-out cursor-pointer disabled:cursor-default focus-visible:ring-2 focus-visible:ring-brand-500"
        :class="classFor(option)"
        @click="pick(option)"
      >
        <div class="flex items-center gap-3">
          <span class="flex-1 text-base font-medium leading-tight">{{ option }}</span>
          <Check v-if="locked && isCorrect(option)" class="w-5 h-5 text-emerald-600 shrink-0" />
          <X v-else-if="locked && option === selected" class="w-5 h-5 text-rose-600 shrink-0" />
        </div>
      </button>
    </div>

    <!-- Hint after answer -->
    <p
      v-if="locked && phrase.phonetic"
      class="text-center text-sm text-muted font-mono animate-fade-in"
    >
      {{ phrase.phonetic }}
    </p>
  </div>
</template>
