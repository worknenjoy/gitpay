// Minimal country-code -> display mapping (flag + UTC offset) for the profile header.
// The `User` model only stores a plain country string — this derives a friendlier
// display from it. Covers a handful of common cases; unknown codes still render
// with just their name, no flag/offset (a fuller mapping is future work).
const COUNTRY_DISPLAY: Record<string, { flagEmoji: string; name: string; utcOffset?: string }> = {
  BR: { flagEmoji: '🇧🇷', name: 'Brazil', utcOffset: '−03:00' },
  US: { flagEmoji: '🇺🇸', name: 'United States', utcOffset: '−05:00' },
  PT: { flagEmoji: '🇵🇹', name: 'Portugal', utcOffset: '+00:00' },
  GB: { flagEmoji: '🇬🇧', name: 'United Kingdom', utcOffset: '+00:00' },
  DE: { flagEmoji: '🇩🇪', name: 'Germany', utcOffset: '+01:00' },
  IN: { flagEmoji: '🇮🇳', name: 'India', utcOffset: '+05:30' }
}

export const countryDisplay = (country?: string) => {
  if (!country) return undefined
  return COUNTRY_DISPLAY[country.toUpperCase()] ?? { flagEmoji: undefined, name: country }
}
