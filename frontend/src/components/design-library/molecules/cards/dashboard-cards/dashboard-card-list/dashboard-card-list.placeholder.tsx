import React from 'react'
import DashboardCardBasePlaceholder from '../dashboard-card-base/dashboard-card-base.placeholder'
import { CardList, ContentWrapper } from './dashboard-card-list.styles'

const DashboardCardListPlaceholder = () => {
  return (
    <ContentWrapper>
      <CardList>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <DashboardCardBasePlaceholder key={`placeholder-${key}`} />
        ))}
      </CardList>
    </ContentWrapper>
  )
}

export default DashboardCardListPlaceholder
