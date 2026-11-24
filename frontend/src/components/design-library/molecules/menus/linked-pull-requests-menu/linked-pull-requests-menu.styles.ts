import { styled } from '@mui/material/styles'

// GitHub's PR state colors — the design keeps them so PRs read the same as on GitHub.
export const PR_STATE_COLORS = {
  open: '#2e7d32',
  merged: '#8250df',
  closed: '#cf222e'
}

export const Chip = styled('button')(({ theme }) => ({
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 28,
  padding: '0 6px 0 9px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 14,
  background: theme.palette.background.paper,
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '& > svg:last-of-type': { color: theme.palette.text.secondary },
  '&:hover, &[aria-expanded="true"]': {
    borderColor: theme.palette.primary.main
  },
  '&[aria-expanded="true"]': {
    boxShadow: `0 0 0 1px ${theme.palette.primary.main} inset`
  }
}))

export const More = styled('em')(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 400,
  color: theme.palette.text.secondary
}))

export const PrIcon = styled('span')({
  display: 'inline-flex',
  color: PR_STATE_COLORS.open,
  '&[data-state="merged"]': { color: PR_STATE_COLORS.merged },
  '&[data-state="closed"]': { color: PR_STATE_COLORS.closed }
})
