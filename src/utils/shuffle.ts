/**
 * Fisher-Yates shuffle, returns a new array.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j] as T, result[i] as T]
  }
  return result
}

export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}
