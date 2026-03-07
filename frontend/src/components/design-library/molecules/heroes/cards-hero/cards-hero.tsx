import React from 'react'
import { Typography } from '@mui/material'
import { Grid } from '@mui/system'
import { FormattedMessage } from 'react-intl'
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
  id: string
  defaultMessage: string
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
          <Typography variant="h6" color="textSecondary">
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
                {card.descriptionList?.length ? (
                  <DescriptionList>
                    {card.descriptionList.map((item) => (
                      <DescriptionListItem key={item.id}>
                        {(item.icon || card.descriptionListIcon) && (
                          <DescriptionListIcon>
                            {item.icon || card.descriptionListIcon}
                          </DescriptionListIcon>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          <FormattedMessage id={item.id} defaultMessage={item.defaultMessage} />
                        </Typography>
                      </DescriptionListItem>
                    ))}
                  </DescriptionList>
                ) : (
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {card.description}
                  </Typography>
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
