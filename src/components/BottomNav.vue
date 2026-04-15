<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Home, BookOpen, PlusCircle } from 'lucide-vue-next'

const items = [
  { to: { name: 'home' }, label: 'Главная', icon: Home },
  { to: { name: 'phrasebook' }, label: 'Разговорник', icon: BookOpen },
  { to: { name: 'my-phrases' }, label: 'Мои', icon: PlusCircle },
] as const
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-30 bg-surface-card/95 dark:bg-surface-card-dark/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-safe"
    aria-label="Главная навигация"
  >
    <ul class="flex items-stretch justify-around max-w-md mx-auto px-2 pt-1.5">
      <li v-for="item in items" :key="item.label" class="flex-1">
        <RouterLink
          :to="item.to"
          class="flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          active-class="!text-brand-600 dark:!text-brand-400"
        >
          <component :is="item.icon" class="w-5 h-5" aria-hidden="true" />
          <span class="text-[11px] font-medium">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
