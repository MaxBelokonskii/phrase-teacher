import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Главная' },
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: 'Категория' },
    props: true,
  },
  {
    path: '/learn/:category',
    name: 'learn',
    component: () => import('@/views/LearnView.vue'),
    meta: { title: 'Учить' },
    props: true,
  },
  {
    path: '/quiz/:category',
    name: 'quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: { title: 'Тест' },
    props: true,
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('@/views/ResultsView.vue'),
    meta: { title: 'Результат' },
  },
  {
    path: '/phrasebook',
    name: 'phrasebook',
    component: () => import('@/views/PhrasebookView.vue'),
    meta: { title: 'Разговорник' },
  },
  {
    path: '/my',
    name: 'my-phrases',
    component: () => import('@/views/MyPhrasesView.vue'),
    meta: { title: 'Мои фразы' },
  },
  {
    path: '/scenarios',
    name: 'scenarios',
    component: () => import('@/views/ScenariosView.vue'),
    meta: { title: 'Сценарии' },
  },
  {
    path: '/scenarios/:id',
    name: 'scenario',
    component: () => import('@/views/ScenarioDetailView.vue'),
    meta: { title: 'Сценарий' },
    props: true,
  },
  {
    path: '/numbers',
    name: 'numbers',
    component: () => import('@/views/NumberView.vue'),
    meta: { title: 'Числа' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/StatsView.vue'),
    meta: { title: 'Статистика' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Настройки' },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Phrase Teacher'
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} · ${base}` : base
})
