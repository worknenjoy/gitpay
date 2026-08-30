import { Avatar, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Profile = styled('div', {
  shouldForwardProp: (prop) => prop !== '$extended'
})<{ $extended?: boolean }>(({ $extended }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '30px',
  flexFlow: 'column',
  flexDirection: 'column',
  flexWrap: 'wrap',
  // Fixed height fit the original 3-line layout; variant pages add roles/CTAs/meta below it.
  height: $extended ? 'auto' : 350
}))

export const BigAvatar = styled(Avatar)({ width: 160, height: 160 })

export const NameContainer = styled('div')({ display: 'flex', alignItems: 'center' })

export const Website = styled(Typography)({
  textAlign: 'center',
  color: '#515bc4',
  fontSize: '0.8rem'
})

export const RoleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(1)
}))

export const CtaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1.5)
}))
