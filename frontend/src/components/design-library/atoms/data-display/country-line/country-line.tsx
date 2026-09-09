import React from 'react'
import { Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'

export type CountryLineProps = {
  flagEmoji?: string
  countryName: string
  utcOffset?: string
}

const CountryLine = ({ flagEmoji, countryName, utcOffset }: CountryLineProps) => (
  <Typography
    variant="caption"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}
  >
    {flagEmoji && <span aria-hidden="true">{flagEmoji}</span>}
    <span>
      {utcOffset ? (
        <FormattedMessage
          id="profile.countryLine.withOffset"
          defaultMessage="{countryName} · UTC{utcOffset}"
          values={{ countryName, utcOffset }}
        />
      ) : (
        countryName
      )}
    </span>
  </Typography>
)

export default CountryLine
