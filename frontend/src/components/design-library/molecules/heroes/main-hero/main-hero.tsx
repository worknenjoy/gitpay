import React from 'react'
import {
  HeroSection,
  Section,
  HeroImage,
  HeroTitle,
  HeroContent,
  HeroActions,
  SpacedButton,
} from './main-hero.styles'
import { Grid, Typography } from '@mui/material'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

type MainHeroProps = {
  mainTitle: React.ReactNode
  description: React.ReactNode
  actions: {
    label: React.ReactNode
    variant?: 'text' | 'outlined' | 'contained'
    color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning'
    onClick?: () => void
  }[]
  image?: string
  animation?: string
}

const MainHero = ({ mainTitle, description, actions, image, animation }: MainHeroProps) => {
  return (
    <Section>
      <HeroSection>
        <Grid container spacing={3} alignContent={'flex-end'}>
          <Grid size={{ xs: 12, sm: 5 }}>
            {image && <HeroImage width={580} src={image} />}
            {animation && <DotLottieReact src={animation} loop autoplay />}
          </Grid>
          <Grid size={{ xs: 12, sm: 7 }}>
            <HeroTitle>
              <Typography variant="h3" gutterBottom align="left">
                {mainTitle}
              </Typography>
            </HeroTitle>
            <HeroContent>
              <Typography variant="h6" gutterBottom align="left">
                {description}
              </Typography>
            </HeroContent>
            <HeroActions>
              {actions.map((action, index) => (
                <SpacedButton
                  variant={action.variant}
                  color={action.color}
                  key={index}
                  onClick={action.onClick}
                >
                  {action.label}
                </SpacedButton>
              ))}
            </HeroActions>
          </Grid>
        </Grid>
      </HeroSection>
    </Section>
  )
}

export default MainHero
