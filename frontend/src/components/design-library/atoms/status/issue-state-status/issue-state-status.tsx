import React from 'react'
import {
  AddTask as CreatedIcon,
  Paid as FundedIcon,
  AssignmentInd as ClaimedIcon,
  TaskAlt as CompletedIcon
} from '@mui/icons-material'
import { Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import MomentComponent from 'moment'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'
import classes, { IssueStateStatusRoot } from './issue-state-status.styles'

type IssueStateStatusProps = {
  state?: string | null
  completed?: boolean
  date?: string | Date | null
}

const IssueStateStatus = ({ state, completed = true, date }: IssueStateStatusProps) => {
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
    <IssueStateStatusRoot>
      <BaseStatus classes={classes} status={state} statusList={statusList} completed={completed} />
      {date && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {MomentComponent(date).fromNow()}
        </Typography>
      )}
    </IssueStateStatusRoot>
  )
}

export default IssueStateStatus
