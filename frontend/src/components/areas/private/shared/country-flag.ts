/**
 * Resolve a country flag image URL.
 * Only known files under images/countries are loaded; missing flags use the default placeholder.
 */

// Webpack require.context: only existing ./name.png assets under src/images/countries
// Relative path is more reliable than alias with require.context
// eslint-disable-next-line @typescript-eslint/no-var-requires
const flagContext = require.context('../../../../images/countries', false, /\.png$/)

const knownKeys = new Set(flagContext.keys())

function resolveModule(key: string): string {
  const mod = flagContext(key)
  return (mod && (mod.default || mod)) as string
}

const PLACEHOLDER_KEY = './default.png'
const placeholderSrc = knownKeys.has(PLACEHOLDER_KEY) ? resolveModule(PLACEHOLDER_KEY) : ''

/**
 * Returns a flag image URL for a slug (e.g. "brazil", "united-states-of-america").
 * Falls back to images/countries/default.png when the flag file is missing.
 */
export function getCountryFlagSrc(imageSlug?: string | null): string {
  const slug = (imageSlug || 'default').replace(/\.png$/i, '')
  const key = `./${slug}.png`
  if (knownKeys.has(key)) {
    return resolveModule(key)
  }
  return placeholderSrc
}

export const countryFlagPlaceholderSrc = placeholderSrc
