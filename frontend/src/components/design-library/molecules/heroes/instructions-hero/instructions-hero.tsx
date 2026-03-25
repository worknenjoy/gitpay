import React from 'react'
import { Container, Divider, Typography } from '@mui/material'
import { Grid } from '@mui/material'

import HeroTitle from 'design-library/atoms/typography/hero-title/hero-title'
import { Section } from '../../../pages/public-pages/home-public-page/CommonStyles'
import {
  ScreenshotImage,
  StepDescription,
  StepMedia,
  StepNumberAvatar,
  StepRow,
  StepText,
  StepTitleRow
} from './instructions-hero.styles'

export type InstructionsHeroStep = {
  title: React.ReactNode
  description?: React.ReactNode
  screenshotSrc?: string
  screenshotAlt?: string
}

type InstructionsHeroProps = {
  title: React.ReactNode
  description?: React.ReactNode
  steps: InstructionsHeroStep[]
  contrast?: boolean
}

const InstructionsHero = ({
  title,
  description,
  steps,
  contrast = false
}: InstructionsHeroProps) => {
  return (
    <Section alternative={contrast}>
      <Container>
        <HeroTitle level="h5">{title}</HeroTitle>
        {description && (
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        )}

        <Grid container spacing={0}>
          {steps.map((step, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }} paddingY={2}>
              <StepRow>
                <StepText>
                  <StepTitleRow>
                    <StepNumberAvatar>{index + 1}</StepNumberAvatar>
                    <Typography variant="h6">{step.title}</Typography>
                  </StepTitleRow>
                  {step.description && (
                    <StepDescription variant="body1">{step.description}</StepDescription>
                  )}
                </StepText>

                {step.screenshotSrc && (
                  <StepMedia>
                    <ScreenshotImage
                      width={100}
                      src={step.screenshotSrc}
                      alt={step.screenshotAlt || ''}
                    />
                  </StepMedia>
                )}
              </StepRow>
              {index < steps.length - 1 && <Divider />}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

export default InstructionsHero
