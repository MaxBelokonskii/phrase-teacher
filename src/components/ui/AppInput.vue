<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  id?: string
  name?: string
  required?: boolean
  autofocus?: boolean
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputId = props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
      <span v-if="required" class="text-rose-500" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autofocus="autofocus"
      class="w-full h-11 px-3.5 rounded-xl bg-surface-card dark:bg-surface-card-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      :class="error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''"
      @input="onInput"
    />
    <p v-if="error" class="text-xs text-rose-500">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>
