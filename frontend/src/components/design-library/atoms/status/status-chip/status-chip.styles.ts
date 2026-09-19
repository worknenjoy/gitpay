import { styled } from '@mui/material/styles'
import { Chip } from '@mui/material'

export type StatusChipTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

// Soft background + dark saturated foreground — the "contained" chip tones used
// across the Dashboard v2 design (D2Chip / gitpay-tokens.css) and already the
// same hex pairs several dashboard-cards hardcode informally per file.
export const TONE_COLORS: Record<StatusChipTone, { bg: string; fg: string }> = {
  success: { bg: '#DCFCE7', fg: '#166534' },
  warning: { bg: '#FEF3C7', fg: '#92400E' },
  error: { bg: '#FFE4E6', fg: '#9F1239' },
  info: { bg: '#E0E7FF', fg: '#3730A3' },
  neutral: { bg: '#e0e0e0', fg: '#353A42' }
}

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'tone'
})<{ tone: StatusChipTone }>(({ tone }) => {
  const { bg, fg } = TONE_COLORS[tone]
  return {
    height: 22,
    borderRadius: 11,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor: bg,
    color: fg,
    '& .MuiChip-label': {
      padding: '0 9px'
    }
  }
})
