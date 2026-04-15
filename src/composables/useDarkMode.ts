import { computed, watchEffect } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Applies the chosen theme mode to <html>:
 *   - 'light' → no class
 *   - 'dark'  → adds 'dark' class
 *   - 'auto'  → follows system preference
 *
 * Tailwind v3 with `darkMode: 'class'` reads the .dark class on <html>.
 */
export function useDarkMode() {
  const settings = useSettingsStore()
  const prefersDark = usePreferredDark()

  const isDark = computed(() => {
    if (settings.themeMode === 'dark') return true
    if (settings.themeMode === 'light') return false
    return prefersDark.value
  })

  watchEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    root.style.colorScheme = isDark.value ? 'dark' : 'light'
  })

  function cycle() {
    const order: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark']
    const idx = order.indexOf(settings.themeMode)
    settings.setThemeMode(order[(idx + 1) % order.length] ?? 'auto')
  }

  return { isDark, cycle }
}
