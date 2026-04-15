<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useDarkMode } from '@/composables/useDarkMode'

// Initialize dark mode reactively. Using inside setup so the watchEffect runs.
useDarkMode()

onMounted(() => {
  // Avoid initial flicker by ensuring the proper class is applied.
  // useDarkMode already does this via watchEffect.
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-base dark:bg-surface-base-dark text-slate-900 dark:text-slate-100">
    <AppHeader />

    <main class="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-12">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <BottomNav class="md:hidden" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
