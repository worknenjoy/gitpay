import React from 'react'
import { Skeleton, Typography } from '@mui/material'
import {
  DefinitionLabel,
  DefinitionList,
  DefinitionRow,
  DefinitionValue,
  Section,
  SectionTitle
} from './details-section.styles'

export { Divider } from './details-section.styles'

export type DetailsItem = {
  label: React.ReactNode
  value: React.ReactNode
  /** visual treatment for the value */
  variant?: 'default' | 'muted' | 'emphasis' | 'negative'
}

export type DetailsSection = {
  title?: React.ReactNode
  items: DetailsItem[]
}

export const valueColor = (variant: DetailsItem['variant'] = 'default') => {
  switch (variant) {
    case 'muted':
      return 'text.secondary'
    case 'emphasis':
      return 'text.primary'
    case 'negative':
      return 'error.main'
    default:
      return 'text.primary'
  }
}

export const valueFontWeight = (variant: DetailsItem['variant'] = 'default') => {
  return variant === 'emphasis' ? 600 : 400
}

export const DetailsSectionPlaceholder = ({ rows = 4 }: { rows?: number }) => (
  <DefinitionList>
    {Array.from({ length: rows }).map((_, i) => (
      <DefinitionRow key={i}>
        <DefinitionLabel>
          <Skeleton variant="text" width={100} />
        </DefinitionLabel>
        <DefinitionValue>
          <Skeleton variant="text" width={64} />
        </DefinitionValue>
      </DefinitionRow>
    ))}
  </DefinitionList>
)

const DetailsSectionComponent = ({ title, items }: DetailsSection) => (
  <Section>
    {title && <SectionTitle variant="subtitle1">{title}</SectionTitle>}
    {items.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    ) : (
      <DefinitionList>
        {items.map((item, itemIndex) => (
          <DefinitionRow key={itemIndex}>
            <DefinitionLabel>{item.label}</DefinitionLabel>
            <DefinitionValue
              sx={{
                color: valueColor(item.variant),
                fontWeight: valueFontWeight(item.variant)
              }}
            >
              {item.value ?? '—'}
            </DefinitionValue>
          </DefinitionRow>
        ))}
      </DefinitionList>
    )}
  </Section>
)

export default DetailsSectionComponent
