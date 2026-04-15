<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="close"
        />
        <div
          class="relative w-full sm:max-w-md card shadow-soft-lg rounded-t-3xl sm:rounded-2xl overflow-hidden animate-slide-up"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="font-display font-semibold text-lg">{{ title }}</h2>
            <button
              type="button"
              class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Закрыть"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="p-5">
            <slot />
          </div>
          <div v-if="$slots.actions" class="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
