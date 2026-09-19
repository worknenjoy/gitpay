import React from 'react'
import Drawer, { DrawerMode } from 'design-library/molecules/drawers/drawer/drawer'
import DetailsSection, {
  Divider,
  DetailsSectionPlaceholder,
  DetailsSection as DetailsSectionShape
} from 'design-library/molecules/data-display/details-section/details-section'

export type {
  DetailsItem,
  DetailsSection
} from 'design-library/molecules/data-display/details-section/details-section'

export type DetailsSidePanelProps = {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  sections?: DetailsSectionShape[]
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
  /** Optional content (e.g. an alert) rendered above the sections, below the title/subtitle. */
  banner?: React.ReactNode
}

const DetailsSidePanel = ({
  open,
  onClose,
  title,
  subtitle,
  sections = [],
  actions = [],
  completed = true,
  children,
  mode = 'compact',
  banner
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
      {!completed && <DetailsSectionPlaceholder />}
      {completed && banner}
      {completed &&
        sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {sectionIndex > 0 && <Divider />}
            <DetailsSection {...section} />
          </React.Fragment>
        ))}
      {completed && children}
    </Drawer>
  )
}

export default DetailsSidePanel
