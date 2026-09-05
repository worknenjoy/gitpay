import React, { useEffect, useState } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Link, Typography } from '@mui/material'
import { StyledCheckbox, StyledFormControlLabel } from './checkbox-terms.styles'
import TermsDialog from './terms-dialog'

const messages = defineMessages({
  bountyLabel: {
    id: 'task.bounties.interested.termsOfUseLabel',
    defaultMessage: 'I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION'
  },
  bountyAnchor: {
    id: 'task.bounties.interested.termsOfUse',
    defaultMessage: 'TERMS OF USE'
  },
  accountLabel: {
    id: 'account.terms.checkbox.label',
    defaultMessage: 'I AGREE WITH THE {termsOfUseAnchor}'
  },
  accountAnchor: {
    id: 'account.terms.checkbox.anchor',
    defaultMessage: 'TERMS OF SERVICE'
  }
})

interface CheckboxTermsProps {
  onAccept: (checked: boolean) => void
  /** Which static label/anchor copy to show — 'bounty' (default) or 'account' (signup). */
  variant?: 'bounty' | 'account'
  content?: React.ReactNode
  align?: 'left' | 'right'
}

const CheckboxTerms = ({
  onAccept,
  variant = 'bounty',
  content,
  align = 'left'
}: CheckboxTermsProps) => {
  const [checked, setChecked] = useState(false)
  const [openTerms, setOpenTerms] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }

  useEffect(() => {
    onAccept?.(checked)
  }, [checked])

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      <StyledFormControlLabel
        control={<StyledCheckbox checked={checked} onChange={handleChange} color="primary" />}
        onClick={handleChange}
        labelPlacement={align === 'right' ? 'start' : 'end'}
        label={
          <Typography variant="caption">
            {variant === 'account' ? (
              <FormattedMessage
                {...messages.accountLabel}
                values={{
                  termsOfUseAnchor: (
                    <Link onClick={() => setOpenTerms(true)}>
                      <FormattedMessage {...messages.accountAnchor} />
                    </Link>
                  )
                }}
              />
            ) : (
              <FormattedMessage
                {...messages.bountyLabel}
                values={{
                  termsOfUseAnchor: (
                    <Link onClick={() => setOpenTerms(true)}>
                      <FormattedMessage {...messages.bountyAnchor} />
                    </Link>
                  )
                }}
              />
            )}
          </Typography>
        }
      />
      <TermsDialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        onAccept={() => setChecked(true)}
        onDisagree={() => setChecked(false)}
        content={content}
      />
    </div>
  )
}

export default CheckboxTerms
