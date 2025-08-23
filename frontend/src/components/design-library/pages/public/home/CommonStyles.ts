import { styled } from '@mui/material/styles'

export const MainTitle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'left' && prop !== 'center',
})(({ theme, left, center }) => ({
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
    marginRight: '18%',
  }),

  ...(center && {
    marginRight: '5%',
    width: '70%',
  }),

  [theme.breakpoints.down('sm')]: {
    width: '60%',
    margin: '20px auto',
    ...(left && { marginLeft: 'auto' }),
  },
}))

export const MainList = styled('div')(({ theme }) => ({
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}))

export const ResponsiveImage = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

export const ShadowImage = styled('img')(({ theme }) => ({
  boxShadow: '1px 1px 3px 2px #ccc',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}))

export const InfoList = styled('div')(({ theme }) => ({
  textAlign: 'left',
  marginLeft: '10%',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}))

export const MainBanner = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  marginBottom: '1rem',
  backgroundColor: 'black',
  backgroundSize: 'cover',
  [theme.breakpoints.down('sm')]: {
    background: 'none',
    backgroundColor: 'black',
  },
}))

export const Section = styled('div', {
  shouldForwardProp: (prop) => prop !== 'alternative',
})(({ alternative }) => ({
  textAlign: 'center',
  padding: '1rem',
  ...(alternative && { backgroundColor: '#f1f0ea' }),
}))

export const HeroTitle = styled('div')({})

export const HeroSection = styled('div')({
  marginTop: 20,
  marginBottom: 20,
})

export const HeroContent = styled('div')({
  marginTop: 28,
  marginBottom: 20,
})

export const HeroActions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10,
})
