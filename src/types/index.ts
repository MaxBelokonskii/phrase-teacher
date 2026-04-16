export type CategoryId =
  | 'greetings'
  | 'airport'
  | 'transport'
  | 'hotel'
  | 'restaurant'
  | 'streetfood'
  | 'shopping'
  | 'sightseeing'
  | 'money_time'
  | 'emergency'
  | 'turkish'
  | 'directions'
  | 'hammam'
  | 'complaints'
  | 'socializing'
  | 'weather'

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: string
  color: string
  hex: string
}

export type Difficulty = 1 | 2 | 3

export interface Phrase {
  id: string
  category: CategoryId
  ru: string
  en: string
  phonetic?: string
  note?: string
  difficulty: Difficulty
  alternatives?: string[]
  isCustom?: boolean
  createdAt?: string
}

export type LeitnerBox = 0 | 1 | 2 | 3 | 4

export interface PhraseProgress {
  phraseId: string
  box: LeitnerBox
  nextReview: string
  lastReviewed?: string
  correctCount: number
  incorrectCount: number
  starred: boolean
}

export interface StreakData {
  current: number
  longest: number
  lastActiveDate: string
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface Settings {
  themeMode: ThemeMode
  ttsRate: number
  ttsVoice: string | null
}

export type AnswerVerdict = 'exact' | 'almost' | 'wrong'

export interface QuizAnswer {
  phraseId: string
  correct: boolean
  verdict?: AnswerVerdict
  userInput?: string
}

export interface QuizSession {
  category: CategoryId | 'all'
  mode: 'multiple-choice' | 'typing'
  startedAt: string
  answers: QuizAnswer[]
}

export interface ExportData {
  version: number
  exportedAt: string
  userPhrases: Phrase[]
  progress: Record<string, PhraseProgress>
  streak: StreakData
  settings: Settings
}
