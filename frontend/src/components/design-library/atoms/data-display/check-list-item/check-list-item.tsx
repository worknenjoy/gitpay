import React from 'react'
import { Skeleton } from '@mui/material'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import PriorityHigh from '@mui/icons-material/PriorityHigh'
import { Row, Badge, Label, CheckListItemState } from './check-list-item.styles'

export type { CheckListItemState }

export type CheckListItemProps = {
  label: React.ReactNode
  state?: CheckListItemState
}

const STATE_ICON: Partial<Record<CheckListItemState, React.ReactNode>> = {
  checked: <Check />,
  failed: <Close />,
  warning: <PriorityHigh />
}

const CheckListItem = ({ label, state = 'empty' }: CheckListItemProps) => (
  <Row>
    {state === 'loading' ? (
      <Skeleton variant="circular" animation="wave" width={18} height={18} />
    ) : (
      <Badge state={state}>{STATE_ICON[state]}</Badge>
    )}
    <Label checked={state === 'checked'}>{label}</Label>
  </Row>
)

export default CheckListItem
