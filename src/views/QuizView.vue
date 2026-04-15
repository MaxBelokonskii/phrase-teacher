<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ChevronLeft, MousePointerClick, Keyboard } from 'lucide-vue-next'
import { getCategoryById } from '@/data/categories'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useQuizSession, type QuizMode } from '@/composables/useQuizSession'
import { shuffle } from '@/utils/shuffle'
import AppButton from '@/components/ui/AppButton.vue'
import QuizMultipleChoice from '@/components/quiz/QuizMultipleChoice.vue'
import QuizTyping from '@/components/quiz/QuizTyping.vue'

const route = useRoute()
const router = useRouter()
const phrasesStore = usePhrasesStore()
const progress = useProgressStore()
const { start, recordAnswer, finish, session } = useQuizSession()

const categoryId = computed(() => String(route.params.category))
const category = computed(() => getCategoryById(categoryId.value))

const mode = ref<QuizMode | null>(null)
const cursor = ref(0)

if (!category.value) {
  router.replace({ name: 'home' })
}

const categoryPhrases = computed(() => (category.value ? phrasesStore.getPhrasesByCategory(category.value.id) : []))
const sessionPhrases = ref<typeof categoryPhrases.value>([])
const currentPhrase = computed(() => sessionPhrases.value[cursor.value] ?? null)

const progressPercent = computed(() =>
  sessionPhrases.value.length === 0
    ? 0
    : Math.round((cursor.value / sessionPhrases.value.length) * 100),
)

function startQuiz(selectedMode: QuizMode) {
  if (!category.value) return
  // Limit to 10 phrases per session, or all if category smaller
  const phrases = shuffle(categoryPhrases.value).slice(0, Math.min(10, categoryPhrases.value.length))
  sessionPhrases.value = phrases
  cursor.value = 0
  mode.value = selectedMode
  start({
    category: category.value.id,
    mode: selectedMode,
    phrases,
  })
}

function onAnswer(correct: boolean, verdict?: 'exact' | 'almost' | 'wrong', userInput?: string) {
  const phrase = currentPhrase.value
  if (!phrase) return
  recordAnswer({
    phraseId: phrase.id,
    correct,
    verdict,
    userInput,
  })
  progress.reviewPhrase(phrase.id, correct)
  if (cursor.value < sessionPhrases.value.length - 1) {
    cursor.value++
  } else {
    finish()
    router.push({ name: 'results' })
  }
}

// Detect "again"/"retry-wrong" mode from query
watch(
  () => route.query.mode,
  (val) => {
    if (val === 'multiple-choice' || val === 'typing') {
      startQuiz(val)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="category" class="space-y-5">
    <RouterLink
      :to="{ name: 'category', params: { id: category.id } }"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
    >
      <ChevronLeft class="w-4 h-4" />
      {{ category.name }}
    </RouterLink>

    <!-- Mode selection -->
    <div v-if="!mode" class="space-y-4">
      <div class="card p-6 text-center space-y-2">
        <h1 class="heading-2">Выберите режим теста</h1>
        <p class="text-sm text-muted">
          Будет {{ Math.min(10, categoryPhrases.length) }}
          {{ Math.min(10, categoryPhrases.length) === 1 ? 'фраза' : 'вопросов' }}
          из категории «{{ category.name }}»
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          class="card-interactive p-5 text-left flex flex-col gap-3"
          @click="startQuiz('multiple-choice')"
        >
          <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
            <MousePointerClick class="w-6 h-6" />
          </span>
          <div>
            <h3 class="font-display font-semibold text-base">Выбор перевода</h3>
            <p class="text-xs text-muted leading-snug mt-0.5">4 варианта на каждый вопрос. Быстро и удобно.</p>
          </div>
        </button>
        <button
          type="button"
          class="card-interactive p-5 text-left flex flex-col gap-3"
          @click="startQuiz('typing')"
        >
          <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cta-100 dark:bg-cta-700/30 text-cta-600 dark:text-cta-400">
            <Keyboard class="w-6 h-6" />
          </span>
          <div>
            <h3 class="font-display font-semibold text-base">Ввод с клавиатуры</h3>
            <p class="text-xs text-muted leading-snug mt-0.5">Напишите перевод сами. Опечатки засчитываются.</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Active quiz -->
    <div v-else-if="currentPhrase" class="space-y-5">
      <div class="flex items-center gap-3 text-sm">
        <div class="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full transition-all duration-300 ease-out"
            :style="{ width: `${progressPercent}%`, backgroundColor: category.hex }"
          />
        </div>
        <span class="font-medium tabular-nums text-muted shrink-0">
          {{ cursor + 1 }} / {{ sessionPhrases.length }}
        </span>
      </div>

      <QuizMultipleChoice
        v-if="mode === 'multiple-choice'"
        :phrase="currentPhrase"
        :pool="categoryPhrases"
        @answer="(c) => onAnswer(c)"
      />
      <QuizTyping
        v-else-if="mode === 'typing'"
        :phrase="currentPhrase"
        @answer="(c, v, i) => onAnswer(c, v, i)"
      />
    </div>

    <div v-else class="card p-8 text-center">
      <p class="text-muted">В этой категории пока нет фраз для теста.</p>
      <AppButton variant="secondary" size="md" class="mt-4" @click="router.push({ name: 'home' })">
        На главную
      </AppButton>
    </div>

    <!-- Live score (small) -->
    <p v-if="mode && session" class="text-center text-xs text-muted tabular-nums">
      Правильно: {{ session.answers.filter(a => a.correct).length }} из {{ session.answers.length }}
    </p>
  </div>
</template>
