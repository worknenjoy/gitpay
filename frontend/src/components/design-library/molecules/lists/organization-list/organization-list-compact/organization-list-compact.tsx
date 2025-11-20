import React from 'react'
import { Root, Item } from './organization-list-compact.styles'
import OrganizationCard from 'design-library/molecules/cards/organization-card/organization-card'
import OrganizationListCompactPlaceholder from './organization-list-compact.placeholder'

export default function OrganizationListCompact({ organizations }) {
  const { data, completed } = organizations
  return completed ? (
    <Root>
      {data.map((o) => {
        return (
          <Item key={o.id}>
            <OrganizationCard organization={o} completed={completed} />
          </Item>
        )
      })}
    </Root>
  ) : (
    <OrganizationListCompactPlaceholder />
  )
}
