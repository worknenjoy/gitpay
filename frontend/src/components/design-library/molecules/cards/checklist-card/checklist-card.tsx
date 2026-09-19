import React from 'react'
import CheckListItem, {
  CheckListItemProps
} from 'design-library/atoms/data-display/check-list-item/check-list-item'
import { RootCard, ProgressWrap, List } from './checklist-card.styles'

export type ChecklistCardItem = CheckListItemProps & { id?: string | number }

type ChecklistCardProps = {
  progress?: React.ReactNode
  items: ChecklistCardItem[]
  completed?: boolean
}

const ChecklistCard = ({ progress, items, completed }: ChecklistCardProps) => {
  const isLoading = completed === false

  return (
    <RootCard>
      {progress && <ProgressWrap>{progress}</ProgressWrap>}
      <List>
        {items.map(({ id, state, ...item }, index) => (
          <CheckListItem key={id ?? index} state={isLoading ? 'loading' : state} {...item} />
        ))}
      </List>
    </RootCard>
  )
}

export default ChecklistCard
