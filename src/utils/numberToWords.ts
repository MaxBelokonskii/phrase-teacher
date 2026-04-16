const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
]

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
]

function convertHundreds(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ONES[n] ?? ''
  if (n < 100) {
    const ten = TENS[Math.floor(n / 10)] ?? ''
    const one = ONES[n % 10] ?? ''
    return one ? `${ten}-${one}` : ten
  }
  const hundred = ONES[Math.floor(n / 100)]
  const remainder = n % 100
  if (remainder === 0) return `${hundred} hundred`
  return `${hundred} hundred and ${convertHundreds(remainder)}`
}

/**
 * Convert an integer (0 to 999,999,999) to English words.
 * Covers all realistic price/number ranges for travel.
 */
export function numberToWords(n: number): string {
  if (!Number.isFinite(n) || n < 0) return ''
  n = Math.floor(n)
  if (n === 0) return 'zero'

  const parts: string[] = []

  const millions = Math.floor(n / 1_000_000)
  const thousands = Math.floor((n % 1_000_000) / 1_000)
  const hundreds = n % 1_000

  if (millions > 0) parts.push(`${convertHundreds(millions)} million`)
  if (thousands > 0) parts.push(`${convertHundreds(thousands)} thousand`)
  if (hundreds > 0) parts.push(convertHundreds(hundreds))

  return parts.join(' ') || 'zero'
}
