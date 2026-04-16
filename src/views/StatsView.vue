<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RotateCcw, Check, XCircle, Volume2, TrendingDown } from 'lucide-vue-next'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useSpeech } from '@/composables/useSpeech'
import { getCategoryById } from '@/data/categories'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const progress = useProgressStore()
const phrases = usePhrasesStore()
const { pronounce, isSupported } = useSpeech()

interface WeakPhrase {
  id: string
  ru: string
  en: string
  categoryName: string
  categoryHex: string
  correctCount: number
  incorrectCount: number
  totalAttempts: number
  errorRate: number
  box: number
}

const weakPhrases = computed<WeakPhrase[]>(() => {
  const items: WeakPhrase[] = []
  for (const [id, prog] of Object.entries(progress.progressMap)) {
    const total = prog.correctCount + prog.incorrectCount
    if (total === 0) continue
    const phrase = phrases.getPhraseById(id)
    if (!phrase) continue
    const cat = getCategoryById(phrase.category)
    items.push({
      id,
      ru: phrase.ru,
      en: phrase.en,
      categoryName: cat?.name ?? '',
      categoryHex: cat?.hex ?? '#888',
      correctCount: prog.correctCount,
      incorrectCount: prog.incorrectCount,
      totalAttempts: total,
      errorRate: prog.incorrectCount / total,
      box: prog.box,
    })
  }
  // Sort by error rate descending, then by total attempts descending (more data = more reliable)
  items.sort((a, b) => {
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate
    return b.totalAttempts - a.totalAttempts
  })
  return items.filter((i) => i.incorrectCount > 0).slice(0, 15)
})

const totalAttempted = computed(() =>
  Object.values(progress.progressMap).filter((p) => p.correctCount + p.incorrectCount > 0).length,
)
const totalCorrect = computed(() =>
  Object.values(progress.progressMap).reduce((sum, p) => sum + p.correctCount, 0),
)
const totalIncorrect = computed(() =>
  Object.values(progress.progressMap).reduce((sum, p) => sum + p.incorrectCount, 0),
)
const overallAccuracy = computed(() => {
  const total = totalCorrect.value + totalIncorrect.value
  return total === 0 ? 0 : Math.round((totalCorrect.value / total) * 100)
})

function retryWeak() {
  if (weakPhrases.value.length === 0) return
  // Navigate to quiz for the first weak phrase's category
  const firstCat = phrases.getPhraseById(weakPhrases.value[0]!.id)?.category
  if (firstCat) {
    router.push({ name: 'quiz', params: { category: firstCat } })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="heading-2 mb-1">Статистика</h1>
      <p class="text-sm text-muted">Анализ ответов и слабые места.</p>
    </div>

    <!-- Overall stats -->
    <section class="grid grid-cols-3 gap-3">
      <div class="card p-4 text-center">
        <p class="font-display font-bold text-2xl text-slate-900 dark:text-slate-100 tabular-nums">{{ totalAttempted }}</p>
        <p class="text-xs text-muted mt-1">Фраз изучено</p>
      </div>
      <div class="card p-4 text-center">
        <p class="font-display font-bold text-2xl tabular-nums" :class="overallAccuracy >= 70 ? 'text-emerald-600' : 'text-cta-500'">{{ overallAccuracy }}%</p>
        <p class="text-xs text-muted mt-1">Точность</p>
      </div>
      <div class="card p-4 text-center">
        <div class="flex items-center justify-center gap-2">
          <span class="font-display font-bold text-lg text-emerald-600 tabular-nums">{{ totalCorrect }}</span>
          <span class="text-slate-400">/</span>
          <span class="font-display font-bold text-lg text-rose-500 tabular-nums">{{ totalIncorrect }}</span>
        </div>
        <p class="text-xs text-muted mt-1">Верно / Ошибок</p>
      </div>
    </section>

    <!-- Weak phrases -->
    <section v-if="weakPhrases.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <TrendingDown class="w-5 h-5 text-rose-500" />
          <h2 class="heading-3">Слабые места</h2>
        </div>
        <AppButton variant="cta" size="sm" @click="retryWeak">
          <RotateCcw class="w-4 h-4" />
          Повторить
        </AppButton>
      </div>

      <ul class="card divide-y divide-slate-100 dark:divide-slate-800">
        <li
          v-for="item in weakPhrases"
          :key="item.id"
          class="p-4 flex items-start gap-3"
        >
          <div class="shrink-0 mt-0.5">
            <XCircle class="w-5 h-5 text-rose-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-display font-semibold text-base leading-tight">{{ item.ru }}</p>
            <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ item.en }}</p>
            <div class="flex items-center gap-3 mt-1.5 flex-wrap">
              <span
                class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
                :style="{ backgroundColor: `${item.categoryHex}15`, color: item.categoryHex }"
              >
                {{ item.categoryName }}
              </span>
              <span class="text-xs text-muted tabular-nums">
                <span class="text-rose-500 font-medium">{{ item.incorrectCount }}</span> ошибок из {{ item.totalAttempts }} попыток
                ({{ Math.round(item.errorRate * 100) }}%)
              </span>
            </div>
          </div>
          <div class="shrink-0">
            <button
              v-if="isSupported"
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors cursor-pointer"
              :aria-label="'Произнести: ' + item.en"
              @click="pronounce(item.en)"
            >
              <Volume2 class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section v-else class="card p-8 text-center space-y-2">
      <Check class="mx-auto w-10 h-10 text-emerald-500" />
      <p class="text-muted" v-if="totalAttempted === 0">
        Пока нет данных. Пройдите хотя бы один тест, чтобы увидеть статистику.
      </p>
      <p class="text-muted" v-else>
        Нет ошибок! Все ответы были верными. Продолжайте в том же духе.
      </p>
    </section>
  </div>
</template>
