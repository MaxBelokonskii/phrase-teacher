<script setup lang="ts">
import { ref, watch, nextTick, useTemplateRef } from 'vue'
import { Check, X, AlertCircle, Volume2 } from 'lucide-vue-next'
import type { Phrase, AnswerVerdict } from '@/types'
import { useFuzzyMatch } from '@/composables/useFuzzyMatch'
import { useSpeech } from '@/composables/useSpeech'
import AppButton from '@/components/ui/AppButton.vue'

interface Props {
  phrase: Phrase
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answer: [correct: boolean, verdict: AnswerVerdict, input: string]
}>()

const input = ref('')
const verdict = ref<AnswerVerdict | null>(null)
const locked = ref(false)
const { judgeAnswer } = useFuzzyMatch()
const { pronounce, isSupported } = useSpeech()
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

watch(
  () => props.phrase.id,
  async () => {
    input.value = ''
    verdict.value = null
    locked.value = false
    await nextTick()
    inputEl.value?.focus()
  },
  { immediate: false },
)

function check() {
  if (locked.value) return
  if (!input.value.trim()) return
  verdict.value = judgeAnswer(input.value, props.phrase.en, props.phrase.alternatives ?? [])
  locked.value = true
  if (isSupported.value && verdict.value !== 'wrong') {
    pronounce(props.phrase.en)
  }
}

function next() {
  const correct = verdict.value === 'exact' || verdict.value === 'almost'
  emit('answer', correct, verdict.value ?? 'wrong', input.value)
}

function onSubmit(event: Event) {
  event.preventDefault()
  if (!locked.value) check()
  else next()
}
</script>

<template>
  <div class="space-y-5">
    <div class="card p-6 text-center">
      <p class="text-xs uppercase tracking-wider text-muted font-semibold mb-3">Напишите перевод на английский</p>
      <p class="text-2xl md:text-3xl font-display font-semibold text-slate-900 dark:text-slate-100">
        {{ phrase.ru }}
      </p>
    </div>

    <form class="space-y-3" @submit="onSubmit">
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        :disabled="locked"
        placeholder="Type the English translation..."
        class="w-full h-14 px-4 rounded-2xl bg-surface-card dark:bg-surface-card-dark border-2 text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors focus:outline-none disabled:opacity-90"
        :class="
          !locked
            ? 'border-slate-200 dark:border-slate-700 focus:border-brand-500'
            : verdict === 'exact'
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20'
              : verdict === 'almost'
                ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-900/20'
                : 'border-rose-500 bg-rose-50/60 dark:bg-rose-900/20'
        "
        autofocus
      />

      <!-- Feedback -->
      <div v-if="locked" class="card p-4 animate-fade-in">
        <div v-if="verdict === 'exact'" class="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
          <Check class="w-5 h-5" />
          Правильно!
        </div>
        <div v-else-if="verdict === 'almost'" class="space-y-1">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium">
            <AlertCircle class="w-5 h-5" />
            Почти! Зачтено.
          </div>
          <p class="text-sm text-muted">
            Правильное написание:
            <span class="font-mono font-semibold text-slate-900 dark:text-slate-100">{{ phrase.en }}</span>
          </p>
        </div>
        <div v-else class="space-y-1">
          <div class="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium">
            <X class="w-5 h-5" />
            Неверно
          </div>
          <p class="text-sm text-muted">
            Правильный ответ:
            <span class="font-mono font-semibold text-slate-900 dark:text-slate-100">{{ phrase.en }}</span>
          </p>
        </div>
        <p v-if="phrase.phonetic" class="text-xs text-muted font-mono mt-2">{{ phrase.phonetic }}</p>
        <button
          v-if="isSupported && verdict !== 'wrong'"
          type="button"
          class="mt-3 inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-300 hover:underline cursor-pointer"
          @click="pronounce(phrase.en)"
        >
          <Volume2 class="w-4 h-4" />
          Услышать снова
        </button>
      </div>

      <AppButton
        v-if="!locked"
        type="submit"
        variant="primary"
        size="lg"
        block
        :disabled="!input.trim()"
      >
        Проверить
      </AppButton>
      <AppButton v-else type="submit" variant="cta" size="lg" block>
        Дальше
      </AppButton>
    </form>
  </div>
</template>
