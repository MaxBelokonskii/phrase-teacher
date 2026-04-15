<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: readonly Option[]
  label?: string
  id?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const inputId = props.id ?? `select-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      class="w-full h-11 px-3.5 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
      @change="onChange"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
