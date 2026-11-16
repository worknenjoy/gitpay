import { styled, keyframes } from '@mui/material/styles'
import { Button } from '@mui/material'
import { TONE_COLORS, StatusChipTone } from '../status-chip/status-chip.styles'

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 currentColor; }
  70% { box-shadow: 0 0 0 5px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`

export const Root = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap'
})

export const Pill = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  boxSizing: 'border-box',
  height: 28,
  padding: '0 12px',
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  '& b': {
    color: theme.palette.text.primary,
    fontWeight: 600
  }
}))

export const Dot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'tone' && prop !== 'pulse'
})<{ tone: StatusChipTone; pulse?: boolean }>(({ tone, pulse }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: TONE_COLORS[tone].fg,
  color: TONE_COLORS[tone].fg,
  ...(pulse && { animation: `${pulseRing} 1.6s ease-out infinite` })
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  height: 28,
  // theme's size="small" variant sets minHeight: 30; keep the button level with the pill
  minHeight: 28,
  minWidth: 0,
  padding: '0 10px',
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 500,
  textTransform: 'none',
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  '& .MuiButton-startIcon': {
    marginRight: 6,
    '& > *:nth-of-type(1)': { fontSize: 16 }
  }
}))
