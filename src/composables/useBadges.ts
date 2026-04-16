import { computed } from 'vue'
import { useProgressStore } from '@/stores/useProgressStore'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import { categories } from '@/data/categories'

export interface Badge {
  id: string
  icon: string
  title: string
  description: string
  earned: boolean
}

export function useBadges() {
  const progress = useProgressStore()
  const phrases = usePhrasesStore()

  const badges = computed<Badge[]>(() => {
    const totalPhrases = phrases.allPhrases.length
    const mastered = progress.totalMastered
    const longestStreak = progress.streak.longest
    const hasAnyAttempt = Object.values(progress.progressMap).some(
      (p) => p.correctCount + p.incorrectCount > 0,
    )
    const hasPerfectQuiz = Object.values(progress.progressMap).some(
      (p) => p.correctCount > 0 && p.incorrectCount === 0 && p.box >= 3,
    )

    const completedCategories = categories.filter((c) => {
      const ids = phrases.getPhrasesByCategory(c.id).map((p) => p.id)
      return ids.length > 0 && progress.masteredCountIn(ids) === ids.length
    }).length

    return [
      {
        id: 'first-test',
        icon: '🎯',
        title: 'Первый шаг',
        description: 'Пройти первый тест',
        earned: hasAnyAttempt,
      },
      {
        id: 'streak-3',
        icon: '🔥',
        title: 'Три дня подряд',
        description: 'Серия 3 дня',
        earned: longestStreak >= 3,
      },
      {
        id: 'streak-7',
        icon: '⚡',
        title: 'Неделя без пропусков',
        description: 'Серия 7 дней',
        earned: longestStreak >= 7,
      },
      {
        id: 'streak-14',
        icon: '💎',
        title: 'Две недели огня',
        description: 'Серия 14 дней',
        earned: longestStreak >= 14,
      },
      {
        id: 'phrases-25',
        icon: '📖',
        title: 'Новичок',
        description: 'Выучить 25 фраз',
        earned: mastered >= 25,
      },
      {
        id: 'phrases-50',
        icon: '📚',
        title: 'Ученик',
        description: 'Выучить 50 фраз',
        earned: mastered >= 50,
      },
      {
        id: 'phrases-100',
        icon: '🎓',
        title: 'Знаток',
        description: 'Выучить 100 фраз',
        earned: mastered >= 100,
      },
      {
        id: 'phrases-200',
        icon: '🏆',
        title: 'Полиглот',
        description: 'Выучить 200 фраз',
        earned: mastered >= 200,
      },
      {
        id: 'phrases-all',
        icon: '👑',
        title: 'Абсолютный мастер',
        description: `Выучить все ${totalPhrases} фраз`,
        earned: mastered >= totalPhrases && totalPhrases > 0,
      },
      {
        id: 'category-1',
        icon: '✅',
        title: 'Первая категория',
        description: 'Пройти одну категорию полностью',
        earned: completedCategories >= 1,
      },
      {
        id: 'category-5',
        icon: '🌟',
        title: 'На полпути',
        description: 'Пройти 5 категорий',
        earned: completedCategories >= 5,
      },
      {
        id: 'category-all',
        icon: '🗺️',
        title: 'Istanbul Ready',
        description: `Пройти все ${categories.length} категорий`,
        earned: completedCategories >= categories.length,
      },
      {
        id: 'perfect-quiz',
        icon: '💯',
        title: 'Безупречный',
        description: 'Ни одной ошибки у фразы (выучена с первого раза)',
        earned: hasPerfectQuiz,
      },
    ]
  })

  const earnedCount = computed(() => badges.value.filter((b) => b.earned).length)
  const totalCount = computed(() => badges.value.length)

  return { badges, earnedCount, totalCount }
}
