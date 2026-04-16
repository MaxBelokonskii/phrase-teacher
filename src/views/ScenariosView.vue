<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import { scenarios } from '@/data/scenarios'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="heading-2 mb-1">Сценарии</h1>
      <p class="text-sm text-muted">Готовые мини-диалоги для типичных ситуаций. Пройдитесь по шагам — и будете знать, что говорить от начала до конца.</p>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <RouterLink
        v-for="scenario in scenarios"
        :key="scenario.id"
        :to="{ name: 'scenario', params: { id: scenario.id } }"
        class="card-interactive p-4 flex items-center gap-4"
      >
        <span
          class="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
          :style="{ backgroundColor: `${scenario.color}18` }"
        >
          {{ scenario.icon }}
        </span>
        <div class="flex-1 min-w-0">
          <h3 class="font-display font-semibold text-base leading-tight">{{ scenario.title }}</h3>
          <p class="text-xs text-muted mt-0.5">{{ scenario.description }} · {{ scenario.steps.length }} реплик</p>
        </div>
        <ChevronRight class="w-5 h-5 text-slate-400 shrink-0" />
      </RouterLink>
    </div>
  </div>
</template>
