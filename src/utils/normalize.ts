/**
 * Normalize a string for fuzzy comparison: lowercase, trim, strip trailing
 * punctuation, collapse multiple spaces.
 */
export function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
}
