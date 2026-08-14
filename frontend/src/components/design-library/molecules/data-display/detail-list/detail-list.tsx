import React from 'react'
import { Box, Typography } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '../../../atoms/buttons/button/button'

export type DetailListAction = {
  label: React.ReactNode
  onClick?: () => void
  href?: string
  /** show the external-link icon (defaults true for Whop deep-links) */
  external?: boolean
}

export type DetailListProps = {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: DetailListAction
  footnote?: React.ReactNode
  completed?: boolean
  children: React.ReactNode
}

/**
 * Agnostic read-only section: header (title/subtitle) + optional right action
 * (e.g. "Edit on Whop") + a list of DetailRow children + optional footnote.
 */
const DetailList = ({
  title,
  subtitle,
  action,
  footnote,
  completed = true,
  children
}: DetailListProps) => (
  <Box>
    {(title || action) && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1,
          mb: 1
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
            endIcon={action.external !== false ? <OpenInNewIcon /> : undefined}
            label={action.label}
            {...(action.href
              ? { component: 'a', href: action.href, target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          />
        ) : null}
      </Box>
    )}
    <Box>{children}</Box>
    {footnote ? (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        {footnote}
      </Typography>
    ) : null}
  </Box>
)

export default DetailList
