<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ChevronLeft, GraduationCap, Brain, CheckCircle2, Circle, Star, Volume2 } from 'lucide-vue-next'
import { getCategoryById } from '@/data/categories'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useSpeech } from '@/composables/useSpeech'
import AppButton from '@/components/ui/AppButton.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import CategoryIcon from '@/components/CategoryIcon.vue'

const route = useRoute()
const router = useRouter()
const phrases = usePhrasesStore()
const progress = useProgressStore()
const { pronounce, isSupported } = useSpeech()

const categoryId = computed(() => String(route.params.id))
const category = computed(() => getCategoryById(categoryId.value))
const categoryPhrases = computed(() =>
  category.value ? phrases.getPhrasesByCategory(category.value.id) : [],
)
const stats = computed(() =>
  progress.categoryProgress(categoryPhrases.value.map((p) => p.id)),
)

if (!category.value) {
  router.replace({ name: 'home' })
}

function goToLearn() {
  if (!category.value) return
  router.push({ name: 'learn', params: { category: category.value.id } })
}

function goToQuiz() {
  if (!category.value) return
  router.push({ name: 'quiz', params: { category: category.value.id } })
}

function speakPhrase(text: string, event: Event) {
  event.stopPropagation()
  pronounce(text)
}

function toggleStar(phraseId: string, event: Event) {
  event.stopPropagation()
  progress.toggleStar(phraseId)
}
</script>

<template>
  <div v-if="category" class="space-y-6">
    <RouterLink
      :to="{ name: 'home' }"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
    >
      <ChevronLeft class="w-4 h-4" />
      Все категории
    </RouterLink>

    <!-- Header -->
    <section class="card p-5 flex items-center gap-4">
      <div
        class="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white"
        :style="{ backgroundColor: category.hex }"
      >
        <CategoryIcon :name="category.icon" class="w-7 h-7" />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="heading-2 leading-tight truncate">{{ category.name }}</h1>
        <p class="text-sm text-muted leading-snug mt-0.5">{{ category.description }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-500 mt-1.5 font-medium tabular-nums">
          {{ stats.mastered }}/{{ stats.total }} фраз выучено
        </p>
      </div>
      <ProgressRing
        :percent="stats.percent"
        :color="category.hex"
        :size="64"
        :stroke="5"
        class="shrink-0"
      />
    </section>

    <!-- Action buttons -->
    <section class="grid grid-cols-2 gap-3">
      <AppButton variant="primary" size="lg" block @click="goToLearn">
        <GraduationCap class="w-5 h-5" />
        Учить
      </AppButton>
      <AppButton variant="cta" size="lg" block @click="goToQuiz">
        <Brain class="w-5 h-5" />
        Тест
      </AppButton>
    </section>

    <!-- Phrases list -->
    <section class="space-y-2">
      <div class="flex items-baseline justify-between mb-1">
        <h2 class="heading-3">Все фразы</h2>
        <span class="text-xs text-muted">{{ categoryPhrases.length }}</span>
      </div>
      <ul class="card divide-y divide-slate-100 dark:divide-slate-800">
        <li
          v-for="phrase in categoryPhrases"
          :key="phrase.id"
          class="p-4 flex items-start gap-3"
        >
          <span class="shrink-0 mt-1 text-brand-600 dark:text-brand-400">
            <CheckCircle2 v-if="progress.isMastered(phrase.id)" class="w-5 h-5" />
            <Circle v-else class="w-5 h-5 text-slate-300 dark:text-slate-600" />
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-display font-semibold text-base text-slate-900 dark:text-slate-100 leading-tight">
              {{ phrase.ru }}
            </p>
            <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ phrase.en }}</p>
            <p v-if="phrase.phonetic" class="text-xs text-muted font-mono mt-0.5">{{ phrase.phonetic }}</p>
            <p v-if="phrase.note" class="text-xs text-muted italic mt-1.5 leading-snug">{{ phrase.note }}</p>
          </div>
          <div class="shrink-0 flex flex-col gap-1">
            <button
              v-if="isSupported"
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors cursor-pointer"
              :aria-label="'Произнести: ' + phrase.en"
              @click="(e) => speakPhrase(phrase.en, e)"
            >
              <Volume2 class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              :class="progress.isStarred(phrase.id) ? 'text-cta-500' : 'text-slate-400 dark:text-slate-500'"
              :aria-label="progress.isStarred(phrase.id) ? 'Убрать из избранного' : 'Добавить в избранное'"
              @click="(e) => toggleStar(phrase.id, e)"
            >
              <Star class="w-4 h-4" :class="progress.isStarred(phrase.id) ? 'fill-current' : ''" />
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
