import React from 'react'
import { Skeleton, Typography } from '@mui/material'
import Drawer, { DrawerMode } from 'design-library/molecules/drawers/drawer/drawer'
import {
  DefinitionLabel,
  DefinitionList,
  DefinitionRow,
  DefinitionValue,
  Divider,
  Section,
  SectionTitle
} from './details-side-panel.styles'

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

export type DetailsSidePanelProps = {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  sections?: DetailsSection[]
  actions?: Array<{
    label: React.ReactNode
    onClick: () => void
    variant?: string
    color?: string
    disabled?: boolean
  }>
  completed?: boolean
  children?: React.ReactNode
  /** Drawer width/density — defaults to 'compact' (360px). Use 'medium' (480px) for panels that need more room. */
  mode?: DrawerMode
}

const valueColor = (variant: DetailsItem['variant'] = 'default') => {
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

const valueFontWeight = (variant: DetailsItem['variant'] = 'default') => {
  return variant === 'emphasis' ? 600 : 400
}

const DetailsSidePanelPlaceholder = ({ rows = 4 }: { rows?: number }) => (
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

const DetailsSidePanel = ({
  open,
  onClose,
  title,
  subtitle,
  sections = [],
  actions = [],
  completed = true,
  children,
  mode = 'compact'
}: DetailsSidePanelProps) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      actions={actions}
      completed={completed}
      mode={mode}
    >
      {!completed && <DetailsSidePanelPlaceholder />}
      {completed &&
        sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {sectionIndex > 0 && <Divider />}
            <Section>
              {section.title && <SectionTitle variant="subtitle1">{section.title}</SectionTitle>}
              {section.items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              ) : (
                <DefinitionList>
                  {section.items.map((item, itemIndex) => (
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
          </React.Fragment>
        ))}
      {completed && children}
    </Drawer>
  )
}

export default DetailsSidePanel
