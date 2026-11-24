import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Check as CheckIcon } from '@mui/icons-material'
import StatusChip from 'design-library/atoms/status/status-chip/status-chip'

export type AuthorTagVariant = 'verified' | 'notAuthor'

type AuthorTagProps = {
  variant: AuthorTagVariant
}

/** Tells whether the person who imported an issue is its author on the provider. */
const AuthorTag = ({ variant }: AuthorTagProps) =>
  variant === 'verified' ? (
    <StatusChip
      tone="success"
      label={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <CheckIcon sx={{ fontSize: 12 }} />
          <FormattedMessage id="authorTag.verified" defaultMessage="Verified author" />
        </span>
      }
    />
  ) : (
    <StatusChip
      tone="neutral"
      label={<FormattedMessage id="authorTag.notAuthor" defaultMessage="Not the author" />}
    />
  )

export default AuthorTag
