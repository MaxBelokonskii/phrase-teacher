<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { X, Volume2 } from 'lucide-vue-next'
import type { Phrase } from '@/types'
import { useSpeech } from '@/composables/useSpeech'

interface Props {
  phrase: Phrase
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { pronounce, isSupported } = useSpeech()

const showRu = ref(false)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      :aria-label="'Показать: ' + phrase.en"
    >
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-4 right-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
        aria-label="Закрыть"
        @click="emit('close')"
      >
        <X class="w-7 h-7" />
      </button>

      <!-- Main phrase -->
      <div class="flex-1 flex flex-col items-center justify-center text-center max-w-2xl w-full gap-6">
        <p
          class="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight text-slate-900 dark:text-slate-100 select-all"
        >
          {{ phrase.en }}
        </p>

        <p
          v-if="phrase.phonetic"
          class="text-lg sm:text-xl text-brand-600 dark:text-brand-300 font-mono"
        >
          {{ phrase.phonetic }}
        </p>

        <!-- Toggle RU translation -->
        <button
          type="button"
          class="text-base text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer underline underline-offset-4"
          @click="showRu = !showRu"
        >
          {{ showRu ? phrase.ru : 'Показать перевод на русский' }}
        </button>
      </div>

      <!-- Bottom actions -->
      <div class="flex items-center gap-3 mt-6">
        <button
          v-if="isSupported"
          type="button"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 transition-colors cursor-pointer text-base font-medium shadow-soft"
          @click="pronounce(phrase.en)"
        >
          <Volume2 class="w-5 h-5" />
          Произнести
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base font-medium"
          @click="emit('close')"
        >
          Закрыть
        </button>
      </div>

      <p class="text-xs text-muted mt-4">Покажите экран собеседнику</p>
    </div>
  </Teleport>
</template>
