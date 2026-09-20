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
  /** Optional: makes a pending step clickable (e.g. "go complete this"). Never
   * applied to a 'checked' item — a finished step has nothing left to link to. */
  onClick?: (e: any) => void
}

const STATE_ICON: Partial<Record<CheckListItemState, React.ReactNode>> = {
  checked: <Check />,
  failed: <Close />,
  warning: <PriorityHigh />
}

const CheckListItem = ({ label, state = 'empty', onClick }: CheckListItemProps) => {
  const isLink = Boolean(onClick) && state !== 'checked'

  return (
    <Row>
      {state === 'loading' ? (
        <Skeleton variant="circular" animation="wave" width={18} height={18} />
      ) : (
        <Badge state={state}>{STATE_ICON[state]}</Badge>
      )}
      <Label checked={state === 'checked'} linked={isLink} onClick={isLink ? onClick : undefined}>
        {label}
      </Label>
    </Row>
  )
}

export default CheckListItem
