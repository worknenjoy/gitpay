import React from 'react'
import { Box, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Button from '../../../atoms/buttons/button/button'
import DeprecatedBadge from '../../../atoms/badges/deprecated-badge/deprecated-badge'
import { ProviderGlyph, RecommendedBadge, ProviderCardRoot } from './payout-provider-card.styles'

export type PayoutProviderCardProps = {
  provider: 'whop' | 'stripe' | 'paypal'
  title: React.ReactNode
  description: React.ReactNode
  /** Feature bullets (Whop card) */
  features?: React.ReactNode[]
  /** Small link under the features, e.g. "See supported countries" */
  link?: { label: React.ReactNode; href?: string; onClick?: () => void }
  recommended?: boolean
  deprecated?: boolean
  /** Warning note shown inside deprecated cards */
  warning?: React.ReactNode
  /** Footnote under the action */
  footnote?: React.ReactNode
  /** When true the provider has a legacy account the user can still open */
  hasExistingAccount?: boolean
  actionLabel?: React.ReactNode
  onAction?: () => void
  /** Label shown when the action is not available (deprecated + no existing account) */
  unavailableLabel?: React.ReactNode
  completed?: boolean
}

const glyphByProvider: Record<
  PayoutProviderCardProps['provider'],
  { letter: string; color: string }
> = {
  whop: { letter: 'W', color: '#d0722a' },
  stripe: { letter: 'S', color: '#8a9099' },
  paypal: { letter: 'P', color: '#8a9099' }
}

/**
 * One provider card for the Payout Settings welcome screen.
 * Context-aware: a deprecated provider with an existing account shows an
 * "Access existing account" action; otherwise it is unavailable.
 */
const PayoutProviderCard = ({
  provider,
  title,
  description,
  features = [],
  link,
  recommended = false,
  deprecated = false,
  warning,
  footnote,
  hasExistingAccount = false,
  actionLabel,
  onAction,
  unavailableLabel,
  completed = true
}: PayoutProviderCardProps) => {
  const glyph = glyphByProvider[provider]
  const actionable = !deprecated || hasExistingAccount

  return (
    <ProviderCardRoot variant="outlined" recommended={recommended ? 1 : 0}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <ProviderGlyph sx={{ bgcolor: glyph.color }}>{glyph.letter}</ProviderGlyph>
        {recommended ? <RecommendedBadge>RECOMMENDED</RecommendedBadge> : null}
        {deprecated ? <DeprecatedBadge /> : null}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      {features.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main', mt: 0.25 }} />
              <Typography variant="body2">{feature}</Typography>
            </Box>
          ))}
        </Box>
      ) : null}

      {warning ? (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            mb: 2,
            borderRadius: 1,
            bgcolor: 'action.hover'
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.25 }} />
          <Typography variant="body2" color="text.secondary">
            {warning}
          </Typography>
        </Box>
      ) : null}

      {link ? (
        <Typography
          variant="body2"
          component={link.href ? 'a' : 'button'}
          href={link.href}
          onClick={link.onClick}
          target={link.href ? '_blank' : undefined}
          rel={link.href ? 'noopener noreferrer' : undefined}
          sx={{
            color: 'secondary.main',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-block',
            mb: 2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0
          }}
        >
          {link.label}
        </Typography>
      ) : null}

      <Box sx={{ mt: 'auto' }}>
        <Button
          fullWidth
          variant={recommended ? 'contained' : 'outlined'}
          color="secondary"
          completed={completed}
          disabled={!actionable}
          onClick={actionable ? onAction : undefined}
          label={actionable ? actionLabel : unavailableLabel}
        />
        {footnote ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            {footnote}
          </Typography>
        ) : null}
      </Box>
    </ProviderCardRoot>
  )
}

export default PayoutProviderCard
