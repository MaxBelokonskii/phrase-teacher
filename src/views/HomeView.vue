<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Sparkles, Trophy, Search, BookOpenCheck } from 'lucide-vue-next'
import { categories } from '@/data/categories'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import CategoryCard from '@/components/CategoryCard.vue'
import StreakBadge from '@/components/StreakBadge.vue'

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
  </div>
</template>
