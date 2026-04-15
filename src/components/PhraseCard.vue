<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Volume2, Star } from 'lucide-vue-next'
import type { Phrase } from '@/types'
import { useSpeech } from '@/composables/useSpeech'
import { useProgressStore } from '@/stores/useProgressStore'
import { getCategoryById } from '@/data/categories'

interface Props {
  phrase: Phrase
  showFront?: 'ru' | 'en'
  /** Reset flip state when phrase changes (for swipeable stack). */
  resetOnChange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFront: 'ru',
  resetOnChange: true,
})

const flipped = ref(false)
const { pronounce, isSupported } = useSpeech()
const progress = useProgressStore()

const category = computed(() => getCategoryById(props.phrase.category))
const isStarred = computed(() => progress.isStarred(props.phrase.id))

watch(
  () => props.phrase.id,
  () => {
    if (props.resetOnChange) flipped.value = false
  },
)

const frontText = computed(() => (props.showFront === 'ru' ? props.phrase.ru : props.phrase.en))
const backText = computed(() => (props.showFront === 'ru' ? props.phrase.en : props.phrase.ru))

function flip() {
  flipped.value = !flipped.value
}

function onPronounce(event: Event) {
  event.stopPropagation()
  pronounce(props.phrase.en)
}

function onToggleStar(event: Event) {
  event.stopPropagation()
  progress.toggleStar(props.phrase.id)
}
</script>

<template>
  <div
    class="flip-card w-full select-none cursor-pointer"
    role="button"
    tabindex="0"
    :aria-label="flipped ? 'Показать вопрос' : 'Показать перевод'"
    @click="flip"
    @keydown.space.prevent="flip"
    @keydown.enter.prevent="flip"
  >
    <div class="flip-card-inner relative w-full" :class="{ 'is-flipped': flipped }" style="min-height: 280px">
      <!-- Front -->
      <div class="flip-face absolute inset-0 card p-6 flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-3">
          <span
            v-if="category"
            class="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            :style="{ backgroundColor: `${category.hex}15`, color: category.hex }"
          >
            {{ category.name }}
          </span>
          <button
            type="button"
            class="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            :class="isStarred ? 'text-cta-500' : 'text-slate-400 dark:text-slate-500'"
            :aria-label="isStarred ? 'Убрать из избранного' : 'Добавить в избранное'"
            @click="onToggleStar"
          >
            <Star class="w-5 h-5" :class="isStarred ? 'fill-current' : ''" />
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <p class="text-2xl md:text-3xl font-display font-semibold leading-tight text-center text-slate-900 dark:text-slate-100">
            {{ frontText }}
          </p>
        </div>
        <p class="text-xs text-center text-muted mt-3">Нажмите, чтобы посмотреть перевод</p>
      </div>

      <!-- Back -->
      <div class="flip-face flip-back absolute inset-0 card p-6 flex flex-col">
        <div class="flex items-start justify-end gap-2 mb-3">
          <button
            v-if="isSupported"
            type="button"
            class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors cursor-pointer"
            :aria-label="'Произнести: ' + phrase.en"
            @click="onPronounce"
          >
            <Volume2 class="w-5 h-5" />
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            :class="isStarred ? 'text-cta-500' : 'text-slate-400 dark:text-slate-500'"
            :aria-label="isStarred ? 'Убрать из избранного' : 'Добавить в избранное'"
            @click="onToggleStar"
          >
            <Star class="w-5 h-5" :class="isStarred ? 'fill-current' : ''" />
          </button>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <p class="text-2xl md:text-3xl font-display font-semibold leading-tight text-slate-900 dark:text-slate-100">
            {{ backText }}
          </p>
          <p v-if="phrase.phonetic" class="text-sm text-brand-600 dark:text-brand-300 font-mono">
            {{ phrase.phonetic }}
          </p>
        </div>
        <p
          v-if="phrase.note"
          class="text-sm text-muted mt-3 italic leading-snug border-t border-slate-100 dark:border-slate-800 pt-3"
        >
          {{ phrase.note }}
        </p>
      </div>
    </div>
  </div>
</template>
