import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Grid, Typography, List, ListItemIcon, ListItemText, Container } from '@mui/material'
import { Section, MainTitle, MainList, ResponsiveImage } from '../../../pages/public-pages/home-public-page/CommonStyles'
import { ListItemTop, AvatarPrimary, HeroContent } from './section-hero.styles'

type SectionHeroProps = {
  title: React.ReactNode;
  image?: string;
  animation?: string;
  content?: React.ReactNode | string;
  items?: {
    icon: React.ReactNode;
    primaryText: React.ReactNode;
    secondaryText: React.ReactNode;
  }[];
  contrast?: boolean;
}

const SectionHero = ({
  title,
  image,
  animation,
  content,
  items,
  contrast = false
}: SectionHeroProps) => {
  return (
    <Section alternative={contrast}>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MainTitle left>
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
            </MainTitle>
            {content && (
              <HeroContent variant="h6" gutterBottom>
                {content}
              </HeroContent>
            )}
            {items && (
              <MainList>
                <List>
                  {items.map((item, index) => (
                    <ListItemTop key={index}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          {item.icon}
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.primaryText}
                        secondary={item.secondaryText}
                      />
                    </ListItemTop>
                  ))}
                </List>
              </MainList>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {image && <ResponsiveImage src={image} />}
            {animation && <DotLottieReact src={animation} loop autoplay />}
          </Grid>
        </Grid>
      </Container>
    </Section>
  )
}
export default SectionHero