import { styled } from '@mui/material/styles'
import { Typography as MuiTypography } from '@mui/material'

// See list-card.styles.ts — this app's real text colors, not palette.text.primary/secondary.
const TEXT_PRIMARY = '#353A42'
const TEXT_SECONDARY = '#6e6e6e'

export const Head = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12
})

export const Title = styled(MuiTypography)(() => ({
  fontSize: 15,
  fontWeight: 500,
  color: TEXT_PRIMARY
}))

export const Count = styled(MuiTypography)(() => ({
  fontSize: 11,
  color: TEXT_SECONDARY,
  whiteSpace: 'nowrap'
}))

export const Track = styled('div')(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  background: theme.palette.divider,
  marginTop: 12,
  overflow: 'hidden'
}))

export const Fill = styled('div')(({ theme }) => ({
  height: '100%',
  borderRadius: 2,
  background: theme.palette.primary.main
}))
