import React from 'react'
import moment from 'moment'
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import { Chip, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import DetailsSidePanel from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import IssueStatus from 'design-library/atoms/status/issue-status/issue-status'
import IssueLanguageField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-language-field/issue-language-field'
import {
  ChipRow,
  SectionHeading,
  ActivityList,
  ActivityItem,
  Avatar,
  ActivityTime
} from './task-detail-drawer.styles'

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export type TaskDetailDrawerTask = {
  id: number | string
  title: string
  description?: string | null
  url?: string
  status?: string
  value?: string | number | null
  createdAt?: string | Date
  Labels?: Array<{ name: string }>
  Project?: { name?: string; repo?: string; ProgrammingLanguages?: Array<{ name: string }> }
  User?: { name?: string; username?: string }
  Assign?: Array<{
    status: string
    createdAt: string | Date
    User?: { name?: string; username?: string }
  }>
  Orders?: Array<{ status: string; amount?: string | number; createdAt: string | Date }>
}

type TaskDetailDrawerProps = {
  task: TaskDetailDrawerTask | null
  open: boolean
  onClose: () => void
}

const TaskDetailDrawer = ({ task, open, onClose }: TaskDetailDrawerProps) => {
  const intl = useIntl()

  if (!task) return null

  const projectLabel = task.Project?.repo || task.Project?.name

  const activity: Array<{ label: React.ReactNode; who?: string; when: string | Date }> = []
  if (task.createdAt) {
    activity.push({
      label: (
        <FormattedMessage id="taskDetailDrawer.activity.opened" defaultMessage="opened the issue" />
      ),
      who: task.User?.name || task.User?.username,
      when: task.createdAt
    })
  }
  ;(task.Assign || []).forEach((assign) => {
    activity.push({
      label:
        assign.status === 'accepted' ? (
          <FormattedMessage
            id="taskDetailDrawer.activity.accepted"
            defaultMessage="was assigned to this issue"
          />
        ) : (
          <FormattedMessage
            id="taskDetailDrawer.activity.interested"
            defaultMessage="requested to work on this"
          />
        ),
      who: assign.User?.name || assign.User?.username,
      when: assign.createdAt
    })
  })
  ;(task.Orders || [])
    .filter((order) => order.status === 'succeeded')
    .forEach((order) => {
      activity.push({
        label: (
          <FormattedMessage
            id="taskDetailDrawer.activity.funded"
            defaultMessage="added a bounty of {amount}"
            values={{
              amount: intl.formatNumber(Number(order.amount) || 0, {
                style: 'currency',
                currency: 'USD'
              })
            }}
          />
        ),
        when: order.createdAt
      })
    })
  activity.sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      mode="medium"
      title={
        <>
          <GitHubIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          {task.title}
        </>
      }
      subtitle={<IssueStatus status={task.status} />}
      sections={[
        {
          items: [
            {
              label: <FormattedMessage id="taskDetailDrawer.bounty" defaultMessage="Bounty" />,
              value:
                task.value != null ? (
                  <FormattedNumber value={Number(task.value)} style="currency" currency="USD" />
                ) : (
                  '—'
                ),
              variant: 'emphasis'
            },
            {
              label: <FormattedMessage id="taskDetailDrawer.posted" defaultMessage="Posted" />,
              value: task.createdAt ? moment(task.createdAt).fromNow() : '—'
            },
            {
              label: <FormattedMessage id="taskDetailDrawer.project" defaultMessage="Project" />,
              value: projectLabel || '—'
            },
            {
              label: <FormattedMessage id="taskDetailDrawer.issue" defaultMessage="Issue" />,
              value: `#${task.id}`
            },
            {
              label: <FormattedMessage id="taskDetailDrawer.author" defaultMessage="Author" />,
              value: task.User?.name || task.User?.username || '—'
            }
          ]
        }
      ]}
      actions={[
        {
          label: <FormattedMessage id="taskDetailDrawer.cancel" defaultMessage="Cancel" />,
          onClick: onClose,
          variant: 'text'
        },
        {
          label: (
            <FormattedMessage id="taskDetailDrawer.viewOnGithub" defaultMessage="View on GitHub" />
          ),
          onClick: () => task.url && window.open(task.url, '_blank'),
          variant: 'outlined'
        },
        {
          label: (
            <FormattedMessage id="taskDetailDrawer.fullDetails" defaultMessage="Full details →" />
          ),
          onClick: () => {
            window.location.hash = `/task/${task.id}`
          },
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    >
      {!!task.Labels?.length && (
        <>
          <SectionHeading variant="subtitle2">
            <FormattedMessage id="taskDetailDrawer.labels" defaultMessage="Labels" />
          </SectionHeading>
          <ChipRow>
            {task.Labels.map((label) => (
              <Chip key={label.name} size="small" variant="outlined" label={label.name} />
            ))}
          </ChipRow>
        </>
      )}

      {!!task.Project?.ProgrammingLanguages?.length && (
        <>
          <SectionHeading variant="subtitle2">
            <FormattedMessage id="taskDetailDrawer.languages" defaultMessage="Languages" />
          </SectionHeading>
          <IssueLanguageField issue={{ Project: task.Project }} />
        </>
      )}

      {task.description && (
        <>
          <SectionHeading variant="subtitle2">
            <FormattedMessage id="taskDetailDrawer.description" defaultMessage="Description" />
          </SectionHeading>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        </>
      )}

      {activity.length > 0 && (
        <>
          <SectionHeading variant="subtitle2">
            <FormattedMessage id="taskDetailDrawer.activity" defaultMessage="Activity" />
          </SectionHeading>
          <ActivityList>
            {activity.map((event, i) => (
              <ActivityItem key={i}>
                <Avatar>{initials(event.who)}</Avatar>
                <div>
                  {event.who && <b>{event.who} </b>}
                  {event.label}
                  <ActivityTime>{moment(event.when).fromNow()}</ActivityTime>
                </div>
              </ActivityItem>
            ))}
          </ActivityList>
        </>
      )}
    </DetailsSidePanel>
  )
}

export default TaskDetailDrawer
