<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ChevronLeft, Volume2, ChevronDown, ChevronUp, User, UserRound } from 'lucide-vue-next'
import { getScenarioById } from '@/data/scenarios'
import { useSpeech } from '@/composables/useSpeech'

const route = useRoute()
const router = useRouter()
const { pronounce, isSupported } = useSpeech()

const scenarioId = computed(() => String(route.params.id))
const scenario = computed(() => getScenarioById(scenarioId.value))

if (!scenario.value) {
  router.replace({ name: 'scenarios' })
}

// Progressive reveal: show steps one by one
const visibleCount = ref(1)
const allRevealed = computed(() => (scenario.value ? visibleCount.value >= scenario.value.steps.length : false))

function revealNext() {
  if (!scenario.value) return
  if (visibleCount.value < scenario.value.steps.length) {
    visibleCount.value++
  }
}

function revealAll() {
  if (scenario.value) visibleCount.value = scenario.value.steps.length
}

function collapseAll() {
  visibleCount.value = 1
}

onMounted(() => {
  visibleCount.value = 1
})
</script>

<template>
  <div v-if="scenario" class="space-y-5">
    <RouterLink
      :to="{ name: 'scenarios' }"
      class="inline-flex items-center gap-1 text-sm text-muted hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
    >
      <ChevronLeft class="w-4 h-4" />
      Все сценарии
    </RouterLink>

    <!-- Header -->
    <section class="card p-5 flex items-center gap-4">
      <span
        class="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl text-3xl"
        :style="{ backgroundColor: `${scenario.color}18` }"
      >
        {{ scenario.icon }}
      </span>
      <div class="flex-1 min-w-0">
        <h1 class="heading-2 leading-tight">{{ scenario.title }}</h1>
        <p class="text-sm text-muted mt-0.5">{{ scenario.description }} · {{ scenario.steps.length }} реплик</p>
      </div>
    </section>

    <!-- Steps -->
    <section class="space-y-3">
      <div
        v-for="(step, idx) in scenario.steps.slice(0, visibleCount)"
        :key="idx"
        class="animate-slide-up"
        :class="step.speaker === 'you' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          class="max-w-[85%] rounded-2xl p-4 space-y-1.5"
          :class="
            step.speaker === 'you'
              ? 'bg-brand-600 text-white rounded-br-md'
              : 'card rounded-bl-md'
          "
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span
              class="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider"
              :class="step.speaker === 'you' ? 'text-brand-200' : 'text-muted'"
            >
              <UserRound v-if="step.speaker === 'you'" class="w-3.5 h-3.5" />
              <User v-else class="w-3.5 h-3.5" />
              {{ step.speaker === 'you' ? 'Вы' : 'Собеседник' }}
            </span>
          </div>
          <p
            class="text-base font-medium leading-snug"
            :class="step.speaker === 'you' ? 'text-white' : 'text-slate-900 dark:text-slate-100'"
          >
            {{ step.en }}
          </p>
          <p
            class="text-sm leading-snug"
            :class="step.speaker === 'you' ? 'text-brand-100' : 'text-muted'"
          >
            {{ step.ru }}
          </p>
          <p
            v-if="step.note"
            class="text-xs italic leading-snug mt-1"
            :class="step.speaker === 'you' ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'"
          >
            {{ step.note }}
          </p>
          <button
            v-if="isSupported"
            type="button"
            class="mt-1 inline-flex items-center gap-1 text-xs cursor-pointer transition-opacity hover:opacity-80"
            :class="step.speaker === 'you' ? 'text-brand-200' : 'text-brand-600 dark:text-brand-300'"
            @click="pronounce(step.en)"
          >
            <Volume2 class="w-3.5 h-3.5" />
            Произнести
          </button>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="flex items-center justify-center gap-3">
      <button
        v-if="!allRevealed"
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 transition-colors cursor-pointer font-medium shadow-soft"
        @click="revealNext"
      >
        <ChevronDown class="w-5 h-5" />
        Следующая реплика
      </button>
      <button
        v-if="!allRevealed"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-sm"
        @click="revealAll"
      >
        Показать все
      </button>
      <button
        v-if="allRevealed"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-sm"
        @click="collapseAll"
      >
        <ChevronUp class="w-5 h-5" />
        Свернуть
      </button>
    </section>
  </div>
</template>
