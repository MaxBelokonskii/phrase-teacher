<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Sun, Moon, Settings as SettingsIcon, MonitorSmartphone, Home, BookOpen, PlusCircle, BarChart3, MessageSquareText } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useDarkMode } from '@/composables/useDarkMode'

const settings = useSettingsStore()
const { isDark, cycle } = useDarkMode()

const themeLabel = computed(() => {
  if (settings.themeMode === 'auto') return 'Системная тема'
  return settings.themeMode === 'dark' ? 'Тёмная тема' : 'Светлая тема'
})
</script>

<template>
  <header class="sticky top-0 z-30 backdrop-blur bg-surface-base/85 dark:bg-surface-base-dark/85 border-b border-slate-200/60 dark:border-slate-800/60">
    <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
      <RouterLink
        :to="{ name: 'home' }"
        class="flex items-center gap-2 group cursor-pointer"
        aria-label="На главную"
      >
        <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-soft transition-transform group-hover:scale-105">
          <span class="font-display font-bold text-lg">P</span>
        </span>
        <span class="font-display font-bold text-base hidden sm:inline">Phrase Teacher</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-1 text-sm">
        <RouterLink
          :to="{ name: 'home' }"
          class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          active-class="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium"
        >
          <Home class="w-4 h-4" />
          Главная
        </RouterLink>
        <RouterLink
          :to="{ name: 'phrasebook' }"
          class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          active-class="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium"
        >
          <BookOpen class="w-4 h-4" />
          Разговорник
        </RouterLink>
        <RouterLink
          :to="{ name: 'scenarios' }"
          class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          active-class="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium"
        >
          <MessageSquareText class="w-4 h-4" />
          Сценарии
        </RouterLink>
        <RouterLink
          :to="{ name: 'my-phrases' }"
          class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          active-class="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium"
        >
          <PlusCircle class="w-4 h-4" />
          Мои фразы
        </RouterLink>
        <RouterLink
          :to="{ name: 'stats' }"
          class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          active-class="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium"
        >
          <BarChart3 class="w-4 h-4" />
          Статистика
        </RouterLink>
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          :title="themeLabel"
          :aria-label="themeLabel"
          @click="cycle"
        >
          <MonitorSmartphone v-if="settings.themeMode === 'auto'" class="w-5 h-5" />
          <Sun v-else-if="!isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
        <RouterLink
          :to="{ name: 'settings' }"
          class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Настройки"
          title="Настройки"
        >
          <SettingsIcon class="w-5 h-5" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
