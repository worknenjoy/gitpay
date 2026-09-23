import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import { Box } from '@mui/material'
import { DetailsItem } from 'design-library/molecules/data-display/details-section/details-section'
import CopyIconButton from 'design-library/atoms/buttons/copy-icon-button/copy-icon-button'
import { formatCurrency } from '../../../../../utils/format-currency'

/** Shared building blocks for the `buildSections()` function behind every details side panel
 * (Payment Request payments, Wallet orders, Claims, Payouts, bounty Payments, Disputes) —
 * factored out because these bits were byte-for-byte duplicated across them, not because any
 * single one of them is meant to be "the" generic panel: each entity's own field list stays
 * local, since what they actually have to show genuinely differs. */

export const MISSING = <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />

export const formatDateTime = (value?: string | Date | null): string | null => {
  if (!value) return null
  return moment(value).format('MMM D, h:mm A')
}

/** Display-only formatting for an already-decimal amount (not cents) — e.g. `12.5` -> `$12.50`.
 * Callers whose amount is stored in cents (Stripe-style) must convert to a decimal amount first
 * (see `convertStripeAmountByCurrency` in balance-card) before passing it in here. */
export const formatMoney = (value?: string | number | null, currency = 'usd'): string | null => {
  if (value === null || value === undefined || value === '') return null
  const amount = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(amount)) return null
  return formatCurrency(amount, 'en-US', currency.toUpperCase())
}

/** A `DetailsItem` showing an id/source with a copy button and ellipsis truncation, right-aligned. */
export const copyableIdItem = (label: React.ReactNode, value?: string | null): DetailsItem => ({
  label,
  value: value ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        justifyContent: 'flex-end',
        minWidth: 0
      }}
    >
      <Box
        component="span"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}
      >
        {value}
      </Box>
      <Box sx={{ flexShrink: 0, display: 'flex' }}>
        <CopyIconButton value={value} />
      </Box>
    </Box>
  ) : (
    MISSING
  )
})

/** The repeated single-entry `DetailsSidePanel.actions` array every panel closes with. */
export const closeAction = (onClose: () => void) => [
  {
    label: <FormattedMessage id="general.buttons.close" defaultMessage="Close" />,
    onClick: onClose,
    variant: 'contained',
    color: 'secondary'
  }
]
