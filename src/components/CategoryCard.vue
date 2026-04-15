<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Category } from '@/types'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import ProgressRing from './ProgressRing.vue'
import CategoryIcon from './CategoryIcon.vue'

interface Props {
  category: Category
}

const props = defineProps<Props>()

const progressStore = useProgressStore()
const phrasesStore = usePhrasesStore()

const phrases = computed(() => phrasesStore.getPhrasesByCategory(props.category.id))
const progress = computed(() =>
  progressStore.categoryProgress(phrases.value.map((p) => p.id)),
)
</script>

<template>
  <RouterLink
    :to="{ name: 'category', params: { id: category.id } }"
    class="card-interactive group p-4 flex items-center gap-4"
  >
    <div
      class="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white transition-transform group-hover:scale-105"
      :style="{ backgroundColor: category.hex }"
    >
      <CategoryIcon :name="category.icon" class="w-6 h-6" />
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="font-display font-semibold text-base text-slate-900 dark:text-slate-100 leading-tight truncate">
        {{ category.name }}
      </h3>
      <p class="text-xs text-muted leading-snug mt-0.5 line-clamp-2">{{ category.description }}</p>
      <p class="text-[11px] text-slate-500 dark:text-slate-500 mt-1 font-medium tabular-nums">
        {{ progress.mastered }}/{{ progress.total }} выучено
      </p>
    </div>
    <div class="shrink-0">
      <ProgressRing :percent="progress.percent" :color="category.hex" :size="48" :stroke="4" />
    </div>
  </RouterLink>
</template>
