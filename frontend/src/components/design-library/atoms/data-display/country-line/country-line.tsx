import React from 'react'
import { Typography } from '@mui/material'
import CountryFlagImage from '../../../../areas/private/shared/country-flag-image'

export type CountryLineProps = {
  /** Flag image slug, e.g. "brazil" — see provider-country-codes.ts's `image` field. */
  image?: string
  countryName: string
  utcOffset?: string
}

const CountryLine = ({ image, countryName, utcOffset }: CountryLineProps) => (
  <Typography
    variant="caption"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
  >
    {image && <CountryFlagImage image={image} alt="" width={18} height={13} />}
    <span>
      {countryName}
      {utcOffset ? ` · UTC${utcOffset}` : ''}
    </span>
  </Typography>
)

export default CountryLine
