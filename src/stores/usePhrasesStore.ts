import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CategoryId, Phrase } from '@/types'
import builtInPhrasesData from '@/data/phrases.json'
import { categories } from '@/data/categories'

const builtInPhrases: Phrase[] = builtInPhrasesData as Phrase[]

const STORAGE_KEY = 'pt_user_phrases'

export const usePhrasesStore = defineStore('phrases', () => {
  const userPhrases = useLocalStorage<Phrase[]>(STORAGE_KEY, [])

  const allPhrases = computed<Phrase[]>(() => {
    const customIds = new Set(userPhrases.value.map((p) => p.id))
    return [
      ...builtInPhrases.filter((p) => !customIds.has(p.id)),
      ...userPhrases.value,
    ]
  })

  const phrasesByCategory = computed(() => {
    const map = new Map<CategoryId, Phrase[]>()
    for (const c of categories) {
      map.set(c.id, [])
    }
    for (const p of allPhrases.value) {
      const list = map.get(p.category)
      if (list) list.push(p)
    }
    return map
  })

  function getPhrasesByCategory(categoryId: CategoryId): Phrase[] {
    return phrasesByCategory.value.get(categoryId) ?? []
  }

  function getPhraseById(id: string): Phrase | undefined {
    return allPhrases.value.find((p) => p.id === id)
  }

  function addUserPhrase(input: {
    category: CategoryId
    ru: string
    en: string
    note?: string
    phonetic?: string
  }): Phrase {
    const id = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
    const phrase: Phrase = {
      id,
      category: input.category,
      ru: input.ru.trim(),
      en: input.en.trim(),
      phonetic: input.phonetic?.trim() || undefined,
      note: input.note?.trim() || undefined,
      difficulty: 1,
      isCustom: true,
      createdAt: new Date().toISOString(),
    }
    userPhrases.value = [...userPhrases.value, phrase]
    return phrase
  }

  function updateUserPhrase(id: string, patch: Partial<Phrase>): boolean {
    const idx = userPhrases.value.findIndex((p) => p.id === id)
    if (idx === -1) return false
    const updated = { ...userPhrases.value[idx], ...patch }
    const next = [...userPhrases.value]
    next[idx] = updated as Phrase
    userPhrases.value = next
    return true
  }

  function deleteUserPhrase(id: string): boolean {
    const next = userPhrases.value.filter((p) => p.id !== id)
    if (next.length === userPhrases.value.length) return false
    userPhrases.value = next
    return true
  }

  function importUserPhrases(phrases: Phrase[]): number {
    // Merge: existing IDs are replaced; new IDs are appended.
    const existingIds = new Set(userPhrases.value.map((p) => p.id))
    const incoming = phrases.filter((p) => p && p.id && p.ru && p.en)
    const merged = [
      ...userPhrases.value.filter((p) => !incoming.some((i) => i.id === p.id)),
      ...incoming.map((p) => ({ ...p, isCustom: true as const })),
    ]
    userPhrases.value = merged
    return incoming.length - existingIds.size > 0 ? incoming.length : merged.length
  }

  function clearUserPhrases() {
    userPhrases.value = []
  }

  return {
    userPhrases,
    allPhrases,
    phrasesByCategory,
    getPhrasesByCategory,
    getPhraseById,
    addUserPhrase,
    updateUserPhrase,
    deleteUserPhrase,
    importUserPhrases,
    clearUserPhrases,
  }
})
