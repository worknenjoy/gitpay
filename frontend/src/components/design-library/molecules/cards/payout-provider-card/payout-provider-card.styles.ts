import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const ProviderCardRoot = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'recommended'
})<{ recommended?: number }>(({ theme, recommended }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  borderColor: recommended ? theme.palette.secondary.main : theme.palette.divider,
  borderStyle: recommended ? 'solid' : 'dashed',
  borderWidth: recommended ? 2 : 1
}))

export const ProviderGlyph = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: theme.spacing(1),
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 20
}))

export const RecommendedBadge = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.success.light,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.75)
}))
