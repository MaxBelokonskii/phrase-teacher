import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CategoryId, LeitnerBox, PhraseProgress, StreakData } from '@/types'

const PROGRESS_KEY = 'pt_progress'
const STREAK_KEY = 'pt_streak'

const BOX_INTERVALS: readonly number[] = [0, 1, 3, 7, 14]
const MASTERED_BOX = 3

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  lastActiveDate: '',
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDaysIso(base: string, days: number): string {
  const date = new Date(base + 'T00:00:00.000Z')
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function diffDays(a: string, b: string): number {
  const aD = new Date(a + 'T00:00:00.000Z').getTime()
  const bD = new Date(b + 'T00:00:00.000Z').getTime()
  return Math.round((aD - bD) / (1000 * 60 * 60 * 24))
}

function defaultProgress(phraseId: string): PhraseProgress {
  return {
    phraseId,
    box: 0,
    nextReview: todayIso(),
    correctCount: 0,
    incorrectCount: 0,
    starred: false,
  }
}

export const useProgressStore = defineStore('progress', () => {
  const progressMap = useLocalStorage<Record<string, PhraseProgress>>(PROGRESS_KEY, {})
  const streak = useLocalStorage<StreakData>(STREAK_KEY, DEFAULT_STREAK, { mergeDefaults: true })

  function getProgress(phraseId: string): PhraseProgress {
    return progressMap.value[phraseId] ?? defaultProgress(phraseId)
  }

  function isMastered(phraseId: string): boolean {
    const p = progressMap.value[phraseId]
    return !!p && p.box >= MASTERED_BOX
  }

  function masteredCountIn(phraseIds: string[]): number {
    let count = 0
    for (const id of phraseIds) {
      if (isMastered(id)) count++
    }
    return count
  }

  function isStarred(phraseId: string): boolean {
    return !!progressMap.value[phraseId]?.starred
  }

  function toggleStar(phraseId: string) {
    const current = getProgress(phraseId)
    progressMap.value = {
      ...progressMap.value,
      [phraseId]: { ...current, starred: !current.starred },
    }
  }

  function reviewPhrase(phraseId: string, correct: boolean) {
    const current = getProgress(phraseId)
    const now = new Date().toISOString()
    let updated: PhraseProgress

    if (correct) {
      const newBox = Math.min(current.box + 1, 4) as LeitnerBox
      updated = {
        ...current,
        box: newBox,
        correctCount: current.correctCount + 1,
        lastReviewed: now,
        nextReview: addDaysIso(todayIso(), BOX_INTERVALS[newBox] ?? 0),
      }
    } else {
      updated = {
        ...current,
        box: 1,
        incorrectCount: current.incorrectCount + 1,
        lastReviewed: now,
        nextReview: addDaysIso(todayIso(), BOX_INTERVALS[1] ?? 1),
      }
    }

    progressMap.value = { ...progressMap.value, [phraseId]: updated }
    bumpStreak()
  }

  function markLearned(phraseId: string) {
    // For "Знаю" button in learn mode: bump box by 1 without recording correct/incorrect.
    const current = getProgress(phraseId)
    const newBox = Math.min(current.box + 1, 4) as LeitnerBox
    progressMap.value = {
      ...progressMap.value,
      [phraseId]: {
        ...current,
        box: newBox,
        nextReview: addDaysIso(todayIso(), BOX_INTERVALS[newBox] ?? 0),
        lastReviewed: new Date().toISOString(),
      },
    }
  }

  function bumpStreak() {
    const today = todayIso()
    const last = streak.value.lastActiveDate
    if (last === today) return

    let nextCurrent = 1
    if (last) {
      const days = diffDays(today, last)
      if (days === 1) {
        nextCurrent = streak.value.current + 1
      } else if (days <= 0) {
        nextCurrent = streak.value.current
      }
    }

    streak.value = {
      current: nextCurrent,
      longest: Math.max(streak.value.longest, nextCurrent),
      lastActiveDate: today,
    }
  }

  function categoryProgress(phraseIds: string[]): { mastered: number; total: number; percent: number } {
    const total = phraseIds.length
    if (total === 0) return { mastered: 0, total: 0, percent: 0 }
    const mastered = masteredCountIn(phraseIds)
    return { mastered, total, percent: Math.round((mastered / total) * 100) }
  }

  const totalMastered = computed(() => {
    return Object.values(progressMap.value).filter((p) => p.box >= MASTERED_BOX).length
  })

  const starredIds = computed(() => {
    return Object.values(progressMap.value)
      .filter((p) => p.starred)
      .map((p) => p.phraseId)
  })

  function importProgress(data: {
    progress?: Record<string, PhraseProgress>
    streak?: StreakData
  }) {
    if (data.progress && typeof data.progress === 'object') {
      progressMap.value = { ...data.progress }
    }
    if (data.streak && typeof data.streak === 'object') {
      streak.value = { ...DEFAULT_STREAK, ...data.streak }
    }
  }

  function reset() {
    progressMap.value = {}
    streak.value = { ...DEFAULT_STREAK }
  }

  return {
    progressMap,
    streak,
    getProgress,
    isMastered,
    isStarred,
    toggleStar,
    reviewPhrase,
    markLearned,
    categoryProgress,
    masteredCountIn,
    totalMastered,
    starredIds,
    importProgress,
    reset,
    // Filter helpers — exposed for review queue building
    isDueToday(phraseId: string, dueByDate?: string): boolean {
      const p = progressMap.value[phraseId]
      const today = dueByDate ?? todayIso()
      return !p || p.nextReview <= today
    },
    serialiseFor(category: CategoryId | undefined, phraseIds: string[] | undefined) {
      // Allows selectively snapshotting; rarely used.
      void category
      const map: Record<string, PhraseProgress> = {}
      const ids = phraseIds ?? Object.keys(progressMap.value)
      for (const id of ids) {
        const p = progressMap.value[id]
        if (p) map[id] = p
      }
      return map
    },
  }
})
