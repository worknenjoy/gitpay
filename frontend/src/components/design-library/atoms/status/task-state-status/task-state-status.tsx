import React from 'react'
import {
  AddTask as CreatedIcon,
  Paid as FundedIcon,
  AssignmentInd as ClaimedIcon,
  TaskAlt as CompletedIcon
} from '@mui/icons-material'
import { useIntl } from 'react-intl'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'
import classes, { TaskStateStatusRoot } from './task-state-status.styles'

type TaskStateStatusProps = {
  state?: string | null
  completed?: boolean
}

const TaskStateStatus = ({ state, completed = true }: TaskStateStatusProps) => {
  const intl = useIntl()

  const statusList = [
    {
      status: 'created',
      label: intl.formatMessage({ id: 'task.state.created', defaultMessage: 'Created' }),
      color: 'created',
      icon: <CreatedIcon className={classes.created} />
    },
    {
      status: 'funded',
      label: intl.formatMessage({ id: 'task.state.funded', defaultMessage: 'Funded' }),
      color: 'funded',
      icon: <FundedIcon className={classes.funded} />
    },
    {
      status: 'claimed',
      label: intl.formatMessage({ id: 'task.state.claimed', defaultMessage: 'Claimed' }),
      color: 'claimed',
      icon: <ClaimedIcon className={classes.claimed} />
    },
    {
      status: 'completed',
      label: intl.formatMessage({ id: 'task.state.completed', defaultMessage: 'Completed' }),
      color: 'completed',
      icon: <CompletedIcon className={classes.completed} />
    }
  ]

  if (!state) return null

  return (
    <TaskStateStatusRoot>
      <BaseStatus classes={classes} status={state} statusList={statusList} completed={completed} />
    </TaskStateStatusRoot>
  )
}

export default TaskStateStatus
