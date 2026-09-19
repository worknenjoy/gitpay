import React from 'react'
import DetailsSection, {
  Divider,
  DetailsSectionPlaceholder,
  DetailsSection as DetailsSectionShape
} from 'design-library/molecules/data-display/details-section/details-section'
import { RootCard, Title, NoteDivider, Note, Cta } from './summary-card.styles'

type SummaryCardProps = {
  title?: React.ReactNode
  sections: DetailsSectionShape[]
  note?: React.ReactNode
  cta?: React.ReactNode
  completed?: boolean
}

const SummaryCard = ({ title, sections, note, cta, completed }: SummaryCardProps) => {
  const isLoading = completed === false

  return (
    <RootCard>
      {title && <Title>{title}</Title>}
      {isLoading ? (
        <DetailsSectionPlaceholder />
      ) : (
        sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {sectionIndex > 0 && <Divider />}
            <DetailsSection {...section} />
          </React.Fragment>
        ))
      )}
      {note && (
        <NoteDivider>
          <Note>{note}</Note>
        </NoteDivider>
      )}
      {cta && <Cta>{cta}</Cta>}
    </RootCard>
  )
}

export default SummaryCard
