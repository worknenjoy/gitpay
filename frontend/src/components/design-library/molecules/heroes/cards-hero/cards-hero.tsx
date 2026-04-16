import React from 'react'
import { Typography } from '@mui/material'
import { Grid } from '@mui/system'
import {
  Section,
  Header,
  RoleCard,
  RoleCardContent,
  RoleImage,
  ActionButton,
  DescriptionList,
  DescriptionListItem,
  DescriptionListIcon
} from './cards-hero.styles'

type CardDescriptionItem = {
  text: React.ReactNode
  icon?: React.ReactNode
}

type RoleCardItem = {
  type: string
  title: React.ReactNode
  description?: React.ReactNode
  descriptionList?: CardDescriptionItem[]
  descriptionListIcon?: React.ReactNode
  image: string
  actionLabel: React.ReactNode
  onAction?: () => void
}

type CardsHeroProps = {
  title: React.ReactNode
  description?: React.ReactNode
  cards: RoleCardItem[]
  withContrast?: boolean
}

const CardsHero = ({ title, description, cards, withContrast = false }: CardsHeroProps) => {
  return (
    <Section $withContrast={withContrast}>
      <Header>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="textSecondary">
            {description}
          </Typography>
        )}
      </Header>
      <Grid container spacing={3} justifyContent="center">
        {cards.map((card) => (
          <Grid key={card.type} size={{ xs: 12, sm: 6, md: 3 }}>
            <RoleCard>
              <RoleCardContent>
                <RoleImage src={card.image} alt={card.type} />
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                {card.description && (
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {card.description}
                  </Typography>
                )}
                {card.descriptionList?.length && (
                  <DescriptionList>
                    {card.descriptionList.map((item, index) => (
                      <DescriptionListItem key={index}>
                        {(item.icon || card.descriptionListIcon) && (
                          <DescriptionListIcon>
                            {item.icon || card.descriptionListIcon}
                          </DescriptionListIcon>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {item.text}
                        </Typography>
                      </DescriptionListItem>
                    ))}
                  </DescriptionList>
                )}
                <ActionButton
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={card.onAction}
                >
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

export default CardsHero
