<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  block: false,
  disabled: false,
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-soft hover:shadow-soft-lg'
    case 'cta':
      return 'bg-cta-500 hover:bg-cta-600 active:bg-cta-700 text-white shadow-soft hover:shadow-soft-lg'
    case 'secondary':
      return 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:text-slate-100'
    case 'ghost':
      return 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:text-slate-200'
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-soft hover:shadow-soft-lg'
  }
  return ''
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3 text-sm gap-1.5'
    case 'lg':
      return 'h-12 px-6 text-base gap-2'
  }
  return 'h-11 px-4 text-sm gap-2'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base dark:focus-visible:ring-offset-surface-base-dark',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
      block ? 'w-full' : '',
      sizeClasses,
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>
