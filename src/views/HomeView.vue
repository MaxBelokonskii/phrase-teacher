<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Sparkles, Trophy, Search, BookOpenCheck, CalendarCheck, Volume2, Maximize2, Hash } from 'lucide-vue-next'
import { categories, getCategoryById } from '@/data/categories'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useSpeech } from '@/composables/useSpeech'
import type { Phrase } from '@/types'
import CategoryCard from '@/components/CategoryCard.vue'
import StreakBadge from '@/components/StreakBadge.vue'
import ShowScreen from '@/components/ShowScreen.vue'

const progress = useProgressStore()
const phrases = usePhrasesStore()

const totalPhrases = computed(() => phrases.allPhrases.length)
const masteredTotal = computed(() => progress.totalMastered)
const overallPercent = computed(() =>
  totalPhrases.value === 0 ? 0 : Math.round((masteredTotal.value / totalPhrases.value) * 100),
)
const masteredCategories = computed(() =>
  categories.filter((c) => {
    const ids = phrases.getPhrasesByCategory(c.id).map((p) => p.id)
    return ids.length > 0 && progress.masteredCountIn(ids) === ids.length
  }).length,
)

const { pronounce, isSupported } = useSpeech()

// Daily review: phrases due today (Leitner nextReview <= today), max 5
const dailyPhrases = computed<Phrase[]>(() => {
  const all = phrases.allPhrases
  const due = all.filter((p) => progress.isDueToday(p.id))
  // Prioritise phrases with some progress (box > 0) over completely new
  const withProgress = due.filter((p) => {
    const prog = progress.progressMap[p.id]
    return prog && prog.box > 0
  })
  const fresh = due.filter((p) => !progress.progressMap[p.id] || progress.progressMap[p.id]?.box === 0)
  return [...withProgress, ...fresh].slice(0, 5)
})

const showScreenPhrase = ref<Phrase | null>(null)
</script>

<template>
  <div class="space-y-6">
    <!-- Hero -->
    <section class="card p-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0 shadow-soft-lg overflow-hidden relative">
      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Sparkles class="w-48 h-48" />
      </div>
      <div class="relative">
        <p class="text-brand-100 text-sm font-medium mb-1">Английский для Стамбула</p>
        <h1 class="heading-1 mb-3">Привет, путешественник!</h1>
        <p class="text-brand-50/90 max-w-md text-sm leading-relaxed">
          Учим живые фразы, которые пригодятся в кафе, на базаре и в такси. Каждый день — пара минут, и Стамбул заговорит с вами по-английски.
        </p>
        <div class="mt-5 flex items-center gap-3 flex-wrap">
          <StreakBadge :current="progress.streak.current" :longest="progress.streak.longest" />
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm">
            <Trophy class="w-5 h-5" />
            <span class="text-sm font-medium tabular-nums">
              {{ masteredTotal }}/{{ totalPhrases }} фраз ({{ overallPercent }}%)
            </span>
          </div>
          <div v-if="masteredCategories > 0" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm">
            <BookOpenCheck class="w-5 h-5" />
            <span class="text-sm font-medium">{{ masteredCategories }} из {{ categories.length }} категорий пройдено</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick actions -->
    <section class="grid grid-cols-2 gap-3">
      <RouterLink
        :to="{ name: 'phrasebook' }"
        class="card-interactive p-4 flex items-center gap-3"
      >
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
          <Search class="w-5 h-5" />
        </span>
        <div class="flex flex-col">
          <span class="font-display font-semibold text-sm">Разговорник</span>
          <span class="text-xs text-muted">Поиск по всем фразам</span>
        </div>
      </RouterLink>
      <RouterLink
        :to="{ name: 'my-phrases' }"
        class="card-interactive p-4 flex items-center gap-3"
      >
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cta-50 dark:bg-cta-700/30 text-cta-600 dark:text-cta-400">
          <Sparkles class="w-5 h-5" />
        </span>
        <div class="flex flex-col">
          <span class="font-display font-semibold text-sm">Мои фразы</span>
          <span class="text-xs text-muted">Добавить свои</span>
        </div>
      </RouterLink>
      <RouterLink
        :to="{ name: 'numbers' }"
        class="card-interactive p-4 flex items-center gap-3 col-span-2 sm:col-span-1"
      >
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
          <Hash class="w-5 h-5" />
        </span>
        <div class="flex flex-col">
          <span class="font-display font-semibold text-sm">Числа</span>
          <span class="text-xs text-muted">Как сказать число по-английски</span>
        </div>
      </RouterLink>
    </section>

    <!-- Daily review -->
    <section v-if="dailyPhrases.length > 0" class="space-y-2">
      <div class="flex items-center gap-2 mb-1">
        <CalendarCheck class="w-5 h-5 text-cta-500" />
        <h2 class="heading-3">Повторите сегодня</h2>
        <span class="text-xs text-muted ml-auto">{{ dailyPhrases.length }} фраз</span>
      </div>
      <ul class="card divide-y divide-slate-100 dark:divide-slate-800">
        <li
          v-for="phrase in dailyPhrases"
          :key="phrase.id"
          class="p-4 flex items-start gap-3"
        >
          <div class="flex-1 min-w-0">
            <p class="font-display font-semibold text-base leading-tight">{{ phrase.ru }}</p>
            <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ phrase.en }}</p>
            <span
              v-if="getCategoryById(phrase.category)"
              class="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
              :style="{
                backgroundColor: `${getCategoryById(phrase.category)!.hex}15`,
                color: getCategoryById(phrase.category)!.hex,
              }"
            >
              {{ getCategoryById(phrase.category)!.name }}
            </span>
          </div>
          <div class="shrink-0 flex flex-col gap-1">
            <button
              v-if="isSupported"
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors cursor-pointer"
              :aria-label="'Произнести: ' + phrase.en"
              @click="pronounce(phrase.en)"
            >
              <Volume2 class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Показать на экране"
              @click="showScreenPhrase = phrase"
            >
              <Maximize2 class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Categories -->
    <section>
      <div class="flex items-baseline justify-between mb-3">
        <h2 class="heading-3">Категории</h2>
        <span class="text-xs text-muted">{{ categories.length }} тем</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CategoryCard v-for="cat in categories" :key="cat.id" :category="cat" />
      </div>
    </section>

    <ShowScreen v-if="showScreenPhrase" :phrase="showScreenPhrase" @close="showScreenPhrase = null" />
  </div>
</template>
