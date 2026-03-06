import React from 'react'
import { Typography } from '@mui/material'
import { Grid } from '@mui/system'
import { Section, Header, RoleCard, RoleCardContent, RoleImage, ActionButton } from './roles-hero.styles'

type RoleCardItem = {
  type: string
  title: React.ReactNode
  description: React.ReactNode
  image: string
  actionLabel: React.ReactNode
  onAction?: () => void
}

type RolesHeroProps = {
  title: React.ReactNode
  description?: React.ReactNode
  cards: RoleCardItem[]
}

const RolesHero = ({ title, description, cards }: RolesHeroProps) => {
  return (
    <Section>
      <Header>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="h6" color="textSecondary">
            {description}
          </Typography>
        )}
      </Header>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.type} size={{ xs: 12, sm: 6, md: 3 }}>
            <RoleCard>
              <RoleCardContent>
                <RoleImage src={card.image} alt={card.type} />
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {card.description}
                </Typography>
                <ActionButton size="small" variant="outlined" color="primary" onClick={card.onAction}>
                  {card.actionLabel}
                </ActionButton>
              </RoleCardContent>
            </RoleCard>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}

export default RolesHero
