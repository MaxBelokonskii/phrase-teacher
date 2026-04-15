<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ChevronLeft, ChevronRight, BrainCircuit, RotateCcw, Check, X } from 'lucide-vue-next'
import { getCategoryById } from '@/data/categories'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { shuffle } from '@/utils/shuffle'
import AppButton from '@/components/ui/AppButton.vue'
import PhraseCard from '@/components/PhraseCard.vue'

const route = useRoute()
const router = useRouter()
const phrasesStore = usePhrasesStore()
const progress = useProgressStore()

const categoryId = computed(() => String(route.params.category) as import('@/types').CategoryId)
const category = computed(() => getCategoryById(categoryId.value))

const phrases = ref(shuffle(phrasesStore.getPhrasesByCategory(categoryId.value)))
const index = ref(0)
const completed = ref(false)

if (!category.value) {
  router.replace({ name: 'home' })
}

onMounted(() => {
  if (phrases.value.length === 0) completed.value = true
})

const current = computed(() => phrases.value[index.value])
const progressPercent = computed(() =>
  phrases.value.length === 0 ? 0 : Math.round(((index.value + 1) / phrases.value.length) * 100),
)

function next() {
  if (index.value < phrases.value.length - 1) {
    index.value++
  } else {
    completed.value = true
  }
}

function prev() {
  if (index.value > 0) index.value--
}

function markKnown() {
  if (!current.value) return
  progress.markLearned(current.value.id)
  next()
}

function markStudying() {
  if (!current.value) return
  // Drop to box 1 (still need review). Don't penalize correctCount.
  next()
}

function restart() {
  phrases.value = shuffle(phrasesStore.getPhrasesByCategory(categoryId.value))
  index.value = 0
  completed.value = false
}

function goToQuiz() {
  router.push({ name: 'quiz', params: { category: categoryId.value } })
}
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

    <!-- Progress -->
    <div v-if="!completed" class="flex items-center gap-3 text-sm">
      <div class="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          class="h-full transition-all duration-300 ease-out"
          :style="{ width: `${progressPercent}%`, backgroundColor: category.hex }"
        />
      </div>
      <span class="font-medium tabular-nums text-muted shrink-0">
        {{ index + 1 }} / {{ phrases.length }}
      </span>
    </div>

    <!-- Card -->
    <div v-if="!completed && current" class="space-y-4">
      <PhraseCard :phrase="current" />

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3">
        <AppButton variant="secondary" size="lg" block @click="markStudying">
          <X class="w-5 h-5" />
          Учу
        </AppButton>
        <AppButton variant="primary" size="lg" block @click="markKnown">
          <Check class="w-5 h-5" />
          Знаю
        </AppButton>
      </div>

      <div class="flex items-center justify-between text-sm">
        <button
          type="button"
          class="inline-flex items-center gap-1 text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          :disabled="index === 0"
          @click="prev"
        >
          <ChevronLeft class="w-4 h-4" />
          Назад
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          @click="next"
        >
          Пропустить
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Completed -->
    <div v-else class="card p-8 text-center space-y-4 animate-fade-in">
      <div
        class="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white"
        :style="{ backgroundColor: category.hex }"
      >
        <Check class="w-8 h-8" />
      </div>
      <div>
        <h2 class="heading-2">Готово!</h2>
        <p class="text-muted mt-1">Вы пролистали все {{ phrases.length }} фраз. Закрепим знания тестом?</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <AppButton variant="cta" size="lg" @click="goToQuiz">
          <BrainCircuit class="w-5 h-5" />
          Перейти к тесту
        </AppButton>
        <AppButton variant="secondary" size="lg" @click="restart">
          <RotateCcw class="w-5 h-5" />
          Повторить ещё раз
        </AppButton>
      </div>
    </div>
  </div>
</template>
