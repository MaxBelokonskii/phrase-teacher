<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percent: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 56,
  stroke: 5,
  color: '#0D9488',
  trackColor: 'rgba(148, 163, 184, 0.25)',
  showLabel: true,
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashoffset = computed(
  () => circumference.value * (1 - Math.max(0, Math.min(100, props.percent)) / 100),
)
const center = computed(() => props.size / 2)
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="stroke"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashoffset"
        style="transition: stroke-dashoffset 400ms cubic-bezier(0.4, 0, 0.2, 1)"
      />
    </svg>
    <span
      v-if="showLabel"
      class="absolute inset-0 flex items-center justify-center font-display font-semibold text-xs text-slate-700 dark:text-slate-200"
    >
      {{ Math.round(percent) }}%
    </span>
  </div>
</template>
