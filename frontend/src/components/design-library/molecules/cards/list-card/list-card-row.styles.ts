import { styled } from '@mui/material/styles'
import { Typography as MuiTypography } from '@mui/material'

// See list-card.styles.ts — this app's real text colors, not palette.text.primary/secondary.
const TEXT_PRIMARY = '#353A42'
const TEXT_SECONDARY = '#6e6e6e'

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: theme.spacing(1.75, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none'
  }
}))

export const ClickableRow = styled(Row)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

export const Left = styled('div')({
  minWidth: 0
})

export const Meta = styled(MuiTypography)(() => ({
  fontSize: 11,
  color: TEXT_SECONDARY,
  marginBottom: 4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}))

export const Title = styled(MuiTypography)(() => ({
  fontSize: 14,
  color: TEXT_PRIMARY
}))

export const Right = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  flexShrink: 0
})

export const AmountWrap = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  gap: 2
})

export const CurrencyPrefix = styled(MuiTypography)(() => ({
  fontSize: 12,
  color: TEXT_SECONDARY
}))

export const Amount = styled(MuiTypography)(() => ({
  fontSize: 14.5,
  fontWeight: 500,
  color: TEXT_PRIMARY,
  whiteSpace: 'nowrap'
}))

export const When = styled(MuiTypography)(() => ({
  fontSize: 12.5,
  color: TEXT_SECONDARY,
  whiteSpace: 'nowrap',
  minWidth: 70,
  textAlign: 'right'
}))
