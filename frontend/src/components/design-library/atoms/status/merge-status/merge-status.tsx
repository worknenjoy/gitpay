import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import BaseStatus from '../base-status/base-status'
import { getMergeStatusStyles } from './merge-status.styles'

export type MergeStatusValue = 'open' | 'merged' | 'closed'

export type MergeStatusProps = {
  status: MergeStatusValue
  completed?: boolean
}

/** Status chip for a pull request or issue's merge state — open, merged, or closed. */
const MergeStatus = ({ status, completed = true }: MergeStatusProps) => {
  const theme = useTheme()
  const intl = useIntl()
  const styles = getMergeStatusStyles(theme)

  const statusList = [
    {
      status: 'merged',
      color: 'merged',
      label: intl.formatMessage({ id: 'design.mergeStatus.merged', defaultMessage: 'Merged' })
    },
    {
      status: 'open',
      color: 'open',
      label: intl.formatMessage({ id: 'design.mergeStatus.open', defaultMessage: 'Open' })
    },
    {
      status: 'closed',
      color: 'closed',
      label: intl.formatMessage({ id: 'design.mergeStatus.closed', defaultMessage: 'Closed' })
    }
  ]

  return (
    <BaseStatus status={status} statusList={statusList} styles={styles} completed={completed} />
  )
}

export default MergeStatus
