import { ref, computed } from 'vue'
import type { CategoryId, Phrase, QuizAnswer } from '@/types'

export type QuizMode = 'multiple-choice' | 'typing'
export type QuizDirection = 'ru-en' | 'en-ru'

interface QuizSessionState {
  category: CategoryId | 'all'
  mode: QuizMode
  direction: QuizDirection
  phrases: Phrase[]
  answers: QuizAnswer[]
  startedAt: string
  finishedAt: string | null
}

const session = ref<QuizSessionState | null>(null)

const SESSION_KEY = 'pt_quiz_session'

function loadFromStorage(): QuizSessionState | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuizSessionState
  } catch {
    return null
  }
}

function saveToStorage(state: QuizSessionState | null) {
  if (typeof sessionStorage === 'undefined') return
  if (!state) {
    sessionStorage.removeItem(SESSION_KEY)
    return
  }
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}

if (session.value === null) {
  session.value = loadFromStorage()
}

export function useQuizSession() {
  function start(input: { category: CategoryId | 'all'; mode: QuizMode; direction?: QuizDirection; phrases: Phrase[] }) {
    session.value = {
      category: input.category,
      mode: input.mode,
      direction: input.direction ?? 'ru-en',
      phrases: input.phrases,
      answers: [],
      startedAt: new Date().toISOString(),
      finishedAt: null,
    }
    saveToStorage(session.value)
  }

  function recordAnswer(answer: QuizAnswer) {
    if (!session.value) return
    session.value = {
      ...session.value,
      answers: [...session.value.answers, answer],
    }
    saveToStorage(session.value)
  }

  function finish() {
    if (!session.value) return
    session.value = { ...session.value, finishedAt: new Date().toISOString() }
    saveToStorage(session.value)
  }

  function clear() {
    session.value = null
    saveToStorage(null)
  }

  const isActive = computed(() => session.value !== null && session.value.finishedAt === null)
  const score = computed(() => {
    if (!session.value) return { correct: 0, total: 0, percent: 0 }
    const total = session.value.answers.length
    const correct = session.value.answers.filter((a) => a.correct).length
    return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100) }
  })
  const wrongPhraseIds = computed(() => {
    if (!session.value) return [] as string[]
    return session.value.answers.filter((a) => !a.correct).map((a) => a.phraseId)
  })

  return {
    session,
    isActive,
    score,
    wrongPhraseIds,
    start,
    recordAnswer,
    finish,
    clear,
  }
}
