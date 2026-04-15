<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  id?: string
  rows?: number
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const inputId = props.id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`
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
    <textarea
      :id="inputId"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full px-3.5 py-2.5 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-y"
      @input="onInput"
    />
    <p v-if="hint" class="text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>
