import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { FormattedMessage } from 'react-intl'
import ChecklistRow, {
  ChecklistRowStatus
} from '../../../atoms/data-display/checklist-row/checklist-row'
import Button from '../../../atoms/buttons/button/button'

export type ChecklistItem = {
  key: string
  title: React.ReactNode
  description?: React.ReactNode
  status: ChecklistRowStatus
}

export type ChecklistProps = {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  items: ChecklistItem[]
  action?: { label: React.ReactNode; onClick?: () => void; href?: string }
  /** Footnote; defaults to the Whop "updates automatically" note */
  footnote?: React.ReactNode
  completed?: boolean
}

/**
 * Agnostic requirements checklist: header + optional "Resolve on Whop" action,
 * a list of ChecklistRow items, and a footnote.
 */
const Checklist = ({
  title,
  subtitle,
  items,
  action,
  footnote,
  completed = true
}: ChecklistProps) => (
  <Box>
    {(title || action) && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
          mb: 1.5
        }}
      >
        <Box>
          {title ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action ? (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            completed={completed}
            onClick={action.onClick}
            endIcon={<OpenInNewIcon />}
            label={action.label}
            {...(action.href
              ? { component: 'a', href: action.href, target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          />
        ) : null}
      </Box>
    )}
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {items.map((item) => (
        <ChecklistRow
          key={item.key}
          title={item.title}
          description={item.description}
          status={item.status}
          completed={completed}
        />
      ))}
    </Paper>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
      <LockOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
      <Typography variant="caption" color="text.secondary">
        {footnote || (
          <FormattedMessage
            id="payout-settings.checklist.footnote"
            defaultMessage="Requirements come from Whop and update automatically."
          />
        )}
      </Typography>
    </Box>
  </Box>
)

export default Checklist
