import React from 'react'
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base'
import { FormattedMessage } from 'react-intl'
import taskIcon from 'images/icons/noun_project management_3063547.svg'
import { IssueDashboardCardChipList } from './my-issue-dashboard-card.styles'
import { Chip } from '@mui/material'

const MyIssuesDashboardCard = ({ issues }) => {
  const { total, open, closed } = issues || {}
  return (
    <DashboardCardBase
      image={taskIcon}
      title={<FormattedMessage id="account.profile.issues.headline" defaultMessage="Issues" />}
      subheader={
        <FormattedMessage
          id="account.profile.issues.overview"
          defaultMessage="{issues} issues imported to Gitpay"
          values={{ issues: total }}
        />
      }
      buttonText={
        <FormattedMessage id="account.profile.issues.buttonText" defaultMessage="See your issues" />
      }
      buttonLink="/profile/tasks"
    >
      <IssueDashboardCardChipList>
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.issues.chip.open"
              defaultMessage="{issuesOpened} issue(s) open"
              values={{ issuesOpened: open }}
            />
          }
          color="success"
        />
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.issues.chip.closed"
              defaultMessage="{closedIssues} issue(s) closed"
              values={{ closedIssues: closed }}
            />
          }
          color="error"
        />
      </IssueDashboardCardChipList>
    </DashboardCardBase>
  )
}

export default MyIssuesDashboardCard
