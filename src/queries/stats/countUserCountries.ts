// Mirrors the length of countryCodesFull in frontend/src/components/areas/private/shared/country-codes.js
// Update this when countries are added or removed from that list.
const SUPPORTED_COUNTRIES_COUNT = 193

export const countUserCountries = async (): Promise<number> => {
  return SUPPORTED_COUNTRIES_COUNT
}
