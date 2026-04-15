<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Volume2, Star, X } from 'lucide-vue-next'
import { categories, getCategoryById } from '@/data/categories'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { useProgressStore } from '@/stores/useProgressStore'
import { useSpeech } from '@/composables/useSpeech'
import { normalize } from '@/utils/normalize'
import AppSelect from '@/components/ui/AppSelect.vue'

const phrasesStore = usePhrasesStore()
const progress = useProgressStore()
const { pronounce, isSupported } = useSpeech()

const query = ref('')
const categoryFilter = ref<string>('all')
const onlyStarred = ref(false)

const categoryOptions = computed(() => [
  { value: 'all', label: 'Все категории' },
  ...categories.map((c) => ({ value: c.id, label: c.name })),
])

const filtered = computed(() => {
  const q = normalize(query.value)
  return phrasesStore.allPhrases.filter((p) => {
    if (categoryFilter.value !== 'all' && p.category !== categoryFilter.value) return false
    if (onlyStarred.value && !progress.isStarred(p.id)) return false
    if (!q) return true
    return (
      normalize(p.ru).includes(q) ||
      normalize(p.en).includes(q) ||
      (p.note ? normalize(p.note).includes(q) : false)
    )
  })
})

function speak(text: string, event: Event) {
  event.stopPropagation()
  pronounce(text)
}

function toggleStar(id: string, event: Event) {
  event.stopPropagation()
  progress.toggleStar(id)
}

function clearQuery() {
  query.value = ''
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="heading-2 mb-1">Разговорник</h1>
      <p class="text-sm text-muted">Все фразы в одном месте. Поиск работает на русском и английском.</p>
    </div>

    <!-- Search & filters -->
    <div class="space-y-3">
      <div class="relative">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="query"
          type="search"
          placeholder="Поиск по фразе..."
          class="w-full h-12 pl-11 pr-11 rounded-2xl bg-surface-card dark:bg-surface-card-dark border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          v-if="query"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Очистить поиск"
          @click="clearQuery"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <AppSelect v-model="categoryFilter" :options="categoryOptions" />
        <label class="inline-flex items-center gap-2 cursor-pointer select-none px-4 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-card dark:bg-surface-card-dark">
          <input v-model="onlyStarred" type="checkbox" class="w-4 h-4 rounded text-cta-500 focus:ring-cta-500 cursor-pointer" />
          <Star class="w-4 h-4 text-cta-500" :class="onlyStarred ? 'fill-current' : ''" />
          <span class="text-sm">Только избранное</span>
        </label>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-xs text-muted">Найдено: {{ filtered.length }}</p>

    <!-- List -->
    <ul v-if="filtered.length > 0" class="card divide-y divide-slate-100 dark:divide-slate-800">
      <li v-for="phrase in filtered" :key="phrase.id" class="p-4 flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <p class="font-display font-semibold text-base leading-tight">{{ phrase.ru }}</p>
          <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ phrase.en }}</p>
          <p v-if="phrase.phonetic" class="text-xs text-muted font-mono mt-0.5">{{ phrase.phonetic }}</p>
          <div class="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              v-if="getCategoryById(phrase.category)"
              class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
              :style="{
                backgroundColor: `${getCategoryById(phrase.category)!.hex}15`,
                color: getCategoryById(phrase.category)!.hex,
              }"
            >
              {{ getCategoryById(phrase.category)!.name }}
            </span>
            <span v-if="phrase.isCustom" class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-cta-100 dark:bg-cta-900/30 text-cta-700 dark:text-cta-300">
              Моя
            </span>
          </div>
        </div>
        <div class="shrink-0 flex flex-col gap-1">
          <button
            v-if="isSupported"
            type="button"
            class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors cursor-pointer"
            :aria-label="'Произнести: ' + phrase.en"
            @click="(e) => speak(phrase.en, e)"
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
    <div v-else class="card p-8 text-center">
      <p class="text-muted">Ничего не найдено. Попробуйте изменить поиск или фильтр.</p>
    </div>
  </div>
</template>
