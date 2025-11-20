import React from 'react'
import { Grid } from '@mui/system'
import { List, ListItemIcon, ListItemText, Divider } from '@mui/material'
import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'
import {
  AltSection,
  ImageContainer,
  ResponsiveImage,
  SecList,
  ListItemTop
} from './secondary-hero.styles'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

type SecondaryHeroProps = {
  image?: string
  animation?: string
  title: React.ReactNode
  items: {
    icon: React.ReactNode
    primaryText: React.ReactNode
    secondaryText: React.ReactNode
  }[]
}

const SecondaryHero = ({ image, animation, title, items }: SecondaryHeroProps) => {
  return (
    <AltSection>
      <HeroTitle level="h5">{title}</HeroTitle>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <ImageContainer>
            {animation && <DotLottieReact src={animation} loop autoplay />}
            {image && <ResponsiveImage width="400" src={image} />}
          </ImageContainer>
        </Grid>
        <Grid size={{ xs: 12, sm: 7 }}>
          <SecList>
            <List>
              {items.map((item, index) => (
                <>
                  <ListItemTop>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
                  </ListItemTop>
                  {index < items.length - 1 && <Divider />}
                </>
              ))}
            </List>
          </SecList>
        </Grid>
      </Grid>
    </AltSection>
  )
}

export default SecondaryHero
