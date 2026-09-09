import React from 'react'
import { useHistory } from 'react-router-dom'
import slugify from '@sindresorhus/slugify'
import { Box, Typography } from '@mui/material'
import { defineMessages, useIntl } from 'react-intl'
import DetailsSidePanel from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import IssueHistoryTimeline from 'design-library/molecules/content/issue-history-timeline/issue-history-timeline'
import IssueLabelsList from 'design-library/molecules/lists/issue-labels-list/issue-labels-list'
import { BountyRow } from 'design-library/molecules/tables/bounties-table/bounties-table'

export type BountyDetailsDrawerBounty = BountyRow & {
  description?: string
  author?: { name: string }
  histories?: any[]
}

export type BountyDetailsDrawerProps = {
  open: boolean
  onClose: () => void
  bounty?: BountyDetailsDrawerBounty
  completed?: boolean
}

const messages = defineMessages({
  overview: { id: 'profile.bountyDrawer.overview', defaultMessage: 'Overview' },
  bounty: { id: 'profile.bountyDrawer.bounty', defaultMessage: 'Bounty' },
  status: { id: 'profile.bountyDrawer.status', defaultMessage: 'Status' },
  statusOpen: { id: 'profile.bountyDrawer.statusOpen', defaultMessage: 'Open' },
  statusClosed: { id: 'profile.bountyDrawer.statusClosed', defaultMessage: 'Closed' },
  posted: { id: 'profile.bountyDrawer.posted', defaultMessage: 'Posted' },
  project: { id: 'profile.bountyDrawer.project', defaultMessage: 'Project' },
  issue: { id: 'profile.bountyDrawer.issue', defaultMessage: 'Issue' },
  author: { id: 'profile.bountyDrawer.author', defaultMessage: 'Author' },
  labels: { id: 'profile.bountyDrawer.labels', defaultMessage: 'Labels' },
  languages: { id: 'profile.bountyDrawer.languages', defaultMessage: 'Languages' },
  description: { id: 'profile.bountyDrawer.description', defaultMessage: 'Description' },
  activity: { id: 'profile.bountyDrawer.activity', defaultMessage: 'Activity' },
  cancel: { id: 'profile.bountyDrawer.cancel', defaultMessage: 'Cancel' },
  viewOnGitHub: { id: 'profile.bountyDrawer.viewOnGitHub', defaultMessage: 'View on GitHub' },
  fullDetails: { id: 'profile.bountyDrawer.fullDetails', defaultMessage: 'Full details' },
  noValue: { id: 'profile.bountyDrawer.noValue', defaultMessage: '—' }
})

const BountyDetailsDrawer = ({
  open,
  onClose,
  bounty,
  completed = true
}: BountyDetailsDrawerProps) => {
  const intl = useIntl()
  const history = useHistory()

  const sections = bounty
    ? [
        {
          title: intl.formatMessage(messages.overview),
          items: [
            {
              label: intl.formatMessage(messages.bounty),
              value: bounty.value ? `$${bounty.value}` : intl.formatMessage(messages.noValue),
              variant: 'emphasis' as const
            },
            {
              label: intl.formatMessage(messages.status),
              value:
                bounty.status === 'open'
                  ? intl.formatMessage(messages.statusOpen)
                  : intl.formatMessage(messages.statusClosed)
            },
            {
              label: intl.formatMessage(messages.posted),
              value: intl.formatDate(bounty.createdAt)
            },
            {
              label: intl.formatMessage(messages.project),
              value: bounty.Project?.name ?? intl.formatMessage(messages.noValue)
            },
            { label: intl.formatMessage(messages.issue), value: `#${bounty.id}` },
            {
              label: intl.formatMessage(messages.author),
              value: bounty.author?.name ?? intl.formatMessage(messages.noValue)
            }
          ]
        }
      ]
    : []

  const languages = bounty?.Project?.ProgrammingLanguages ?? []

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      title={bounty?.title ?? ''}
      completed={completed}
      mode="medium"
      sections={sections}
      banner={
        bounty && ((bounty.Labels?.length ?? 0) > 0 || languages.length > 0) ? (
          <Box sx={{ mb: 2 }}>
            {(bounty.Labels?.length ?? 0) > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
                  {intl.formatMessage(messages.labels)}
                </Typography>
                <IssueLabelsList labels={bounty.Labels} completed />
              </Box>
            )}
            {languages.length > 0 && (
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
                  {intl.formatMessage(messages.languages)}
                </Typography>
                <IssueLabelsList labels={languages} completed />
              </Box>
            )}
          </Box>
        ) : null
      }
      actions={[
        { label: intl.formatMessage(messages.cancel), onClick: onClose, variant: 'text' },
        {
          label: intl.formatMessage(messages.viewOnGitHub),
          onClick: () => bounty?.url && window.open(bounty.url, '_blank', 'noreferrer'),
          variant: 'outlined'
        },
        {
          label: intl.formatMessage(messages.fullDetails),
          onClick: () =>
            bounty && history.push(`/task/${bounty.id}/${slugify(bounty.title || '')}`),
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    >
      {bounty?.description && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {intl.formatMessage(messages.description)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bounty.description}
          </Typography>
        </Box>
      )}
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {intl.formatMessage(messages.activity)}
      </Typography>
      <IssueHistoryTimeline histories={bounty?.histories} />
    </DetailsSidePanel>
  )
}

export default BountyDetailsDrawer
