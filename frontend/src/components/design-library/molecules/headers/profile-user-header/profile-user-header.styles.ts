import { Avatar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Profile = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '30px',
  flexFlow: 'column',
  flexDirection: 'column',
  flexWrap: 'wrap',
  height: 350,
}))

export const BigAvatar = styled(Avatar)({ width: 160, height: 160 })

export const NameContainer = styled('div')({ display: 'flex', alignItems: 'center' })

export const Website = styled(Typography)({
  textAlign: 'center',
  color: '#515bc4',
  fontSize: '0.8rem',
})
