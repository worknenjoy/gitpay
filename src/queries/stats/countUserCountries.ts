import { countryCodesFull } from '../../../frontend/src/components/areas/private/shared/country-codes.js'

export const countUserCountries = async (): Promise<number> => {
  return countryCodesFull.length
}
