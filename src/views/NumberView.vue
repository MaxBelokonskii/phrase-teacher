<script setup lang="ts">
import { ref, computed } from 'vue'
import { Volume2, Hash, Delete } from 'lucide-vue-next'
import { numberToWords } from '@/utils/numberToWords'
import { useSpeech } from '@/composables/useSpeech'

const { pronounce, isSupported } = useSpeech()

const input = ref('')

const parsedNumber = computed(() => {
  const cleaned = input.value.replace(/\D/g, '')
  if (!cleaned) return null
  const n = parseInt(cleaned, 10)
  if (!Number.isFinite(n) || n < 0 || n > 999_999_999) return null
  return n
})

const words = computed(() => {
  if (parsedNumber.value === null) return ''
  return numberToWords(parsedNumber.value)
})

function speak() {
  if (words.value) pronounce(words.value)
}

function clear() {
  input.value = ''
}

function appendDigit(d: string) {
  if (input.value.length >= 9) return
  input.value += d
}

function backspace() {
  input.value = input.value.slice(0, -1)
}

const pad = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', '←'],
] as const
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="heading-2 mb-1">Калькулятор чисел</h1>
      <p class="text-sm text-muted">Введите число — увидите, как сказать его по-английски. Идеально для торга.</p>
    </div>

    <!-- Display -->
    <section class="card p-6 text-center space-y-3">
      <div class="flex items-center justify-center gap-2">
        <Hash class="w-5 h-5 text-muted" />
        <p class="font-mono text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tabular-nums min-h-[1.2em]">
          {{ input || '0' }}
        </p>
      </div>
      <div v-if="words" class="space-y-2 animate-fade-in">
        <p class="text-xl md:text-2xl font-display font-semibold text-brand-700 dark:text-brand-300 leading-snug">
          {{ words }}
        </p>
        <button
          v-if="isSupported"
          type="button"
          class="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-300 hover:underline cursor-pointer"
          @click="speak"
        >
          <Volume2 class="w-4 h-4" />
          Произнести
        </button>
      </div>
      <p v-else class="text-sm text-muted">Введите число от 0 до 999 999 999</p>
    </section>

    <!-- Numpad -->
    <section class="max-w-xs mx-auto">
      <div class="grid grid-cols-3 gap-2">
        <template v-for="row in pad" :key="row.join()">
          <button
            v-for="key in row"
            :key="key"
            type="button"
            class="h-14 rounded-2xl font-display font-semibold text-xl transition-all cursor-pointer flex items-center justify-center"
            :class="
              key === 'C'
                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50'
                : key === '←'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-surface-card dark:bg-surface-card-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-soft'
            "
            @click="key === 'C' ? clear() : key === '←' ? backspace() : appendDigit(key)"
          >
            <Delete v-if="key === '←'" class="w-5 h-5" />
            <span v-else>{{ key }}</span>
          </button>
        </template>
      </div>
    </section>

    <!-- Quick examples -->
    <section class="card p-4">
      <p class="text-xs uppercase tracking-wider text-muted font-semibold mb-2">Быстрые примеры</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="n in [50, 100, 250, 500, 750, 1000, 1500, 5000]"
          :key="n"
          type="button"
          class="px-3 py-1.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer"
          @click="input = String(n)"
        >
          {{ n.toLocaleString('ru') }}
        </button>
      </div>
    </section>
  </div>
</template>
