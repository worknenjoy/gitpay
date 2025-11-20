import { Card, CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledCard = styled(Card)(() => ({
  minWidth: 420,
  marginTop: 40,
  opacity: 0.8,
  overflow: 'visible',
}))

export const StyledCardContent = styled(CardContent)(() => ({
  textAlign: 'center',
  position: 'relative',
}))

export const Content = styled('div')({
  marginTop: 20,
})
