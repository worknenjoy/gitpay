import { Button, Card, CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'

type SectionProps = {
  $withContrast?: boolean
}

export const Section = styled('section', {
  shouldForwardProp: (prop) => prop !== '$withContrast'
})<SectionProps>(({ theme, $withContrast }) => ({
  padding: '1rem',
  marginTop: 20,
  marginBottom: 20,
  backgroundColor: $withContrast ? theme.palette.primary.contrastText : 'transparent'
}))

export const Header = styled('div')({
  textAlign: 'center',
  marginBottom: 28
})

export const RoleCard = styled(Card)({
  height: '100%'
})

export const RoleCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  height: '100%'
})

export const RoleImage = styled('img')(({ theme }) => ({
  width: 112,
  height: 112,
  objectFit: 'contain',
  marginBottom: 14,
  [theme.breakpoints.down('sm')]: {
    width: 92,
    height: 92
  }
}))

export const ActionButton = styled(Button)({
  marginTop: 'auto'
})
