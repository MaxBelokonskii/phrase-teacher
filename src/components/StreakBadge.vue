<script setup lang="ts">
import { Flame } from 'lucide-vue-next'

interface Props {
  current: number
  longest?: number
  compact?: boolean
}

withDefaults(defineProps<Props>(), { compact: false })
</script>

<template>
  <div
    v-if="!compact"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-cta-500 to-cta-600 text-white shadow-soft"
  >
    <Flame class="w-5 h-5" :class="current > 0 ? 'animate-pulse' : ''" />
    <div class="flex flex-col leading-tight">
      <span class="text-xs font-medium opacity-90">Серия</span>
      <span class="font-display font-bold text-base">{{ current }} {{ current === 1 ? 'день' : (current >= 2 && current <= 4 ? 'дня' : 'дней') }}</span>
    </div>
    <div v-if="longest && longest > current" class="text-[11px] opacity-80 ml-1 border-l border-white/30 pl-2">
      рекорд:&nbsp;{{ longest }}
    </div>
  </div>
  <div v-else class="inline-flex items-center gap-1.5 text-cta-600 dark:text-cta-400 font-semibold">
    <Flame class="w-4 h-4" />
    <span>{{ current }}</span>
  </div>
</template>
