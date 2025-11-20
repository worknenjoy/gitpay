import fs from 'fs'

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function centsToDecimal(
  amount: number | null | undefined,
  currency: string | undefined
): string {
  if (typeof amount !== 'number') return ''
  const zeroMinor = new Set(['JPY', 'KRW', 'VND'])
  const cur = (currency || '').toUpperCase()
  if (zeroMinor.has(cur)) return String(amount)
  return (amount / 100).toFixed(2)
}

export function formatCurrencyPtBR(
  amount: number | null | undefined,
  currency: string | undefined
): string {
  if (typeof amount !== 'number' || !currency) return ''
  const cur = currency.toUpperCase()
  try {
    const zeroMinor = new Set(['JPY', 'KRW', 'VND'])
    const major = zeroMinor.has(cur) ? amount : amount / 100
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: cur }).format(major)
  } catch {
    return `${centsToDecimal(amount, cur)} ${cur}`.trim()
  }
}

export function formatDateForSheets(tsSec: number | null | undefined): string {
  if (!tsSec) return ''
  const d = new Date(tsSec * 1000)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mi = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} UTC`
}

export function csvEscape(value: string): string {
  if (value == null) return ''
  const needsQuotes = /[",\n]/.test(value) || value.includes(',')
  const v = String(value).replace(/"/g, '""')
  return needsQuotes ? `"${v}"` : v
}
