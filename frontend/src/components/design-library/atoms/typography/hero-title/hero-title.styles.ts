import { styled, Theme } from '@mui/material/styles'

interface MainTitleProps {
  left?: boolean
  center?: boolean
}

export const HeroTitleStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'left' && prop !== 'center'
})<MainTitleProps>(({ theme, left, center }: { theme: Theme } & MainTitleProps) => ({
  textAlign: 'center',
  display: 'block',
  paddingBottom: 10,
  borderBottom: '5px solid black',
  width: '60%',

  marginTop: 20,
  marginLeft: 'auto',
  marginBottom: 20,
  marginRight: 'auto',

  ...(left && {
    marginRight: '18%'
  }),

  ...(center && {
    marginRight: '5%',
    width: '70%'
  }),

  [theme.breakpoints.down('sm')]: {
    width: '60%',
    margin: '20px auto',
    ...(left && { marginLeft: 'auto' })
  }
}))
