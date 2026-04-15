import type { AnswerVerdict } from '@/types'
import { normalize } from '@/utils/normalize'

/**
 * Levenshtein distance between two strings.
 * Implementation uses a 2-row DP table for O(n*m) time and O(min(n,m)) memory.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = new Array<number>(b.length + 1)
  let curr = new Array<number>(b.length + 1)

  for (let j = 0; j <= b.length; j++) prev[j] = j

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1
      curr[j] = Math.min(
        (curr[j - 1] ?? 0) + 1,
        (prev[j] ?? 0) + 1,
        (prev[j - 1] ?? 0) + cost,
      )
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length] ?? 0
}

/**
 * Compare a typed answer against the expected one (and any alternatives).
 * Returns:
 *   - 'exact'  — normalized strings match
 *   - 'almost' — within ~20% character distance (typo)
 *   - 'wrong'  — neither
 */
export function judgeAnswer(
  input: string,
  expected: string,
  alternatives: string[] = [],
): AnswerVerdict {
  const candidates = [expected, ...alternatives].map(normalize)
  const inp = normalize(input)
  if (!inp) return 'wrong'

  if (candidates.includes(inp)) return 'exact'

  let minDist = Infinity
  let target = expected
  for (const c of candidates) {
    const d = levenshtein(inp, c)
    if (d < minDist) {
      minDist = d
      target = c
    }
  }
  const tolerance = Math.max(1, Math.floor(target.length * 0.2))
  return minDist <= tolerance ? 'almost' : 'wrong'
}

export function useFuzzyMatch() {
  return { judgeAnswer, levenshtein }
}
