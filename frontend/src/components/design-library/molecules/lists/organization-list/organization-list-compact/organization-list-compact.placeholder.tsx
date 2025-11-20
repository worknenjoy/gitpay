import React from 'react'
import { Root, Item } from './organization-list-compact.styles'
import OrganizationCardPlaceholder from 'design-library/molecules/cards/organization-card/organization-card.placeholder'

const OrganizationListCompactPlaceholder = () => {
  return (
    <Root>
      {Array.from(new Array(3)).map((_, index) => (
        <Item key={index}>
          <OrganizationCardPlaceholder />
        </Item>
      ))}
    </Root>
  )
}

export default OrganizationListCompactPlaceholder
