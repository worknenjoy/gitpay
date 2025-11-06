import { Button } from '@mui/material';
import { styled } from '@mui/material/styles'

interface MainTitleProps {
  left?: boolean;
  center?: boolean;
}

export const ResponsiveImage = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%'
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

export const HeroTitle = styled('div')({
  lineHeight: 1.2
})

export const HeroSection = styled('div')({
  marginTop: 20,
  marginBottom: 20
})

export const HeroContent = styled('div')({
  marginTop: 28,
  marginBottom: 20,
  '.MuiTypography-root': {
    lineHeight: 1.6
  }
})

export const HeroActions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10
})

// Image helpers
export const HeroImage = styled(ResponsiveImage)(() => ({
  width: '100%'
}))

export const SpacedButton = styled(Button)(() => ({
  marginRight: 20
}))