import { Card, CardContent } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

const getThemePaletteByVariant = (theme, variant = 'default') => {
  const variants = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
    default: theme.palette.primary
  }

  return variants[variant] || variants.default
}

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$themeVariant'
})<{ $themeVariant?: string }>(({ theme, $themeVariant = 'default' }) => {
  const palette = getThemePaletteByVariant(theme, $themeVariant)

  return {
    minWidth: 420,
    marginTop: 40,
    opacity: 0.8,
    overflow: 'visible',
    borderTop: `4px solid ${palette.main}`,
    background: `linear-gradient(180deg, ${alpha(palette.light || palette.main, 0.14)} 0%, ${alpha(
      theme.palette.background.paper,
      0.95
    )} 55%)`
  }
})

export const StyledCardContent = styled(CardContent)(() => ({
  textAlign: 'center',
  position: 'relative'
}))

export const Content = styled('div')({
  marginTop: 20
})
