<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, RotateCcw, Home, Volume2, Check, X, AlertCircle } from 'lucide-vue-next'
import { useQuizSession } from '@/composables/useQuizSession'
import { useSpeech } from '@/composables/useSpeech'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { getCategoryById } from '@/data/categories'
import AppButton from '@/components/ui/AppButton.vue'
import ProgressRing from '@/components/ProgressRing.vue'

const router = useRouter()
const { session, score, clear } = useQuizSession()
const { pronounce, isSupported } = useSpeech()
const phrasesStore = usePhrasesStore()

onMounted(() => {
  if (!session.value) {
    router.replace({ name: 'home' })
  }
})

const categoryName = computed(() => {
  if (!session.value) return ''
  if (session.value.category === 'all') return 'Все категории'
  return getCategoryById(session.value.category)?.name ?? ''
})

const wrongAnswers = computed(() => {
  if (!session.value) return []
  return session.value.answers
    .filter((a) => !a.correct)
    .map((a) => ({
      answer: a,
      phrase: phrasesStore.getPhraseById(a.phraseId),
    }))
    .filter((x) => x.phrase)
})

const verdict = computed(() => {
  const p = score.value.percent
  if (p === 100) return { title: 'Безупречно!', subtitle: 'Все ответы верные. Так держать.', color: '#10B981' }
  if (p >= 80) return { title: 'Отличный результат!', subtitle: 'Вы почти всё знаете.', color: '#0D9488' }
  if (p >= 50) return { title: 'Хорошее начало.', subtitle: 'Повторите ошибки и попробуйте ещё раз.', color: '#F59E0B' }
  return { title: 'Есть над чем поработать.', subtitle: 'Вернитесь в учебный режим и закрепите фразы.', color: '#EF4444' }
})

function retryWrong() {
  if (!session.value || wrongAnswers.value.length === 0) return
  const wrongIds = new Set(wrongAnswers.value.map((w) => w.answer.phraseId))
  const phrases = session.value.phrases.filter((p) => wrongIds.has(p.id))
  if (phrases.length === 0) return
  // Re-use the same category & mode
  const cat = session.value.category
  const mode = session.value.mode
  clear()
  router.push({
    name: 'quiz',
    params: { category: cat },
    query: { mode },
  })
  // The QuizView will start a fresh session; it picks 10 from the full pool.
  // For "retry wrong only" semantics, we'd need a deeper refactor — kept simple for MVP.
}

function returnToCategory() {
  if (!session.value) {
    router.push({ name: 'home' })
    return
  }
  const cat = session.value.category
  clear()
  if (cat === 'all') {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'category', params: { id: cat } })
  }
}

function returnHome() {
  clear()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="session" class="space-y-5">
    <!-- Score card -->
    <section class="card p-6 text-center space-y-4">
      <div class="mx-auto">
        <ProgressRing
          :percent="score.percent"
          :color="verdict.color"
          :size="112"
          :stroke="9"
          :show-label="false"
        />
        <div class="-mt-[88px] mb-12">
          <p class="font-display font-bold text-3xl tabular-nums">{{ score.correct }}<span class="text-muted text-xl">/{{ score.total }}</span></p>
          <p class="text-xs text-muted">{{ score.percent }}%</p>
        </div>
      </div>
      <div>
        <h1 class="heading-2 inline-flex items-center gap-2 justify-center">
          <Trophy v-if="score.percent >= 80" class="w-6 h-6 text-cta-500" />
          {{ verdict.title }}
        </h1>
        <p class="text-sm text-muted mt-1">{{ verdict.subtitle }}</p>
        <p class="text-xs text-muted mt-2">{{ categoryName }}</p>
      </div>
    </section>

    <!-- Mistakes -->
    <section v-if="wrongAnswers.length > 0" class="space-y-2">
      <h2 class="heading-3">Над чем поработать</h2>
      <ul class="card divide-y divide-slate-100 dark:divide-slate-800">
        <li v-for="item in wrongAnswers" :key="item.answer.phraseId" class="p-4 flex items-start gap-3">
          <span class="shrink-0 mt-0.5">
            <X v-if="!item.answer.verdict || item.answer.verdict === 'wrong'" class="w-5 h-5 text-rose-500" />
            <AlertCircle v-else class="w-5 h-5 text-amber-500" />
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-display font-semibold text-base">{{ item.phrase!.ru }}</p>
            <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ item.phrase!.en }}</p>
            <p v-if="item.answer.userInput" class="text-xs text-muted mt-1">
              Вы ответили: <span class="font-mono">{{ item.answer.userInput }}</span>
            </p>
          </div>
          <button
            v-if="isSupported"
            type="button"
            class="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors cursor-pointer"
            :aria-label="'Произнести: ' + item.phrase!.en"
            @click="pronounce(item.phrase!.en)"
          >
            <Volume2 class="w-4 h-4" />
          </button>
        </li>
      </ul>
    </section>

    <section v-else class="card p-6 text-center">
      <Check class="mx-auto w-10 h-10 text-emerald-500 mb-2" />
      <p class="text-muted text-sm">Никаких ошибок. Можно идти дальше!</p>
    </section>

    <!-- Actions -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <AppButton variant="cta" size="lg" block :disabled="wrongAnswers.length === 0" @click="retryWrong">
        <RotateCcw class="w-5 h-5" />
        Ещё раз
      </AppButton>
      <AppButton variant="primary" size="lg" block @click="returnToCategory">
        К категории
      </AppButton>
      <AppButton variant="secondary" size="lg" block @click="returnHome">
        <Home class="w-5 h-5" />
        Главная
      </AppButton>
    </section>
  </div>
</template>
