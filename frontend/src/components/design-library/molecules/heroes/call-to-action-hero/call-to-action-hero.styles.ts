import { styled, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export const CallToActionHeroStyled = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 500,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: 400,
  }
}))

export const DotLottieReactStyled = styled(DotLottieReact)(({ theme }) => ({
  position: 'absolute',
  top: 120,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
  [theme.breakpoints.down('sm')]: {
    top: 220,
    width: '100% !important',
    height: 'auto !important',
  }
}))
  

// Root wrapper
export const Root = styled('div')(() => ({
  flexGrow: 1,
  marginTop: 0
}))

export const ResponsiveImage = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}))

export const BaseSection = styled('div', {
  shouldForwardProp: (prop) => prop !== 'alternative'
})<SectionProps>(({ alternative }) => ({
  textAlign: 'center',
  padding: '1rem',
  ...(alternative && { backgroundColor: '#f1f0ea' })
}));

// Section with alternate background
export const AltSection = styled(BaseSection)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText
}))

// Image helpers
export const HeroImage = styled(ResponsiveImage)(() => ({
  width: '100%'
}))

export const ImageContainer = styled('div')(() => ({
  marginLeft: 20
}))

// Lists
export const SecList = styled('div')(() => ({
  padding: 20
}))

export const ListItemTop = styled(ListItem)(() => ({
  marginTop: 0
}))

// Buttons
export const GutterTopButton = styled(Button)<ButtonProps>(() => ({
  marginTop: 20
}))

export const MLButton = styled(Button)(() => ({
  marginLeft: 20
}))

// Bottom call-to-action section and copy
export const BottomCTASection = styled(BaseSection)(() => ({
  height: 350,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}))

export const BottomCopy = styled(Typography)(() => ({
  padding: '0 60px',
  lineHeight: 1.4,
}))

interface MainTitleProps {
  left?: boolean;
  center?: boolean;
}

export const MainList = styled('div')(({ theme }) => ({
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0
  }
}))

export const ShadowImage = styled('img')(({ theme }) => ({
  boxShadow: '1px 1px 3px 2px #ccc',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%'
  }
}))

export const InfoList = styled('div')(({ theme }) => ({
  textAlign: 'left',
  marginLeft: '10%',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0
  }
}))

export const MainBanner = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  marginBottom: '1rem',
  backgroundColor: 'black',
  backgroundSize: 'cover',
  [theme.breakpoints.down('sm')]: {
    background: 'none',
    backgroundColor: 'black'
  }
}))

interface SectionProps {
  alternative?: boolean;
}

export const Section = styled('div', {
  shouldForwardProp: (prop) => prop !== 'alternative'
})<SectionProps>(({ alternative }) => ({
  textAlign: 'center',
  padding: '1rem',
  ...(alternative && { backgroundColor: '#f1f0ea' })
}));

export const HeroTitle = styled('div')({})

export const HeroSection = styled('div')({
  marginTop: 20,
  marginBottom: 20
})

export const HeroContent = styled('div')({
  marginTop: 28,
  marginBottom: 20
})

export const HeroActions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10
})
