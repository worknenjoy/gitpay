import React from 'react'
import { Typography } from '@mui/material'
import {
  Visibility as ViewDetailsIcon,
  GitHub as GitHubIcon,
  ContentCopy as CopyLinkIcon
} from '@mui/icons-material'
import { defineMessages, useIntl } from 'react-intl'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import {
  customColumnRenderer,
  useIssueMetadata
} from 'design-library/molecules/tables/issue-table/issue-table'
import ActionsMenu from 'design-library/molecules/menus/actions-menu/actions-menu'

export type BountyRow = {
  id: string | number
  title: string
  status: string
  value: number
  provider?: string
  url?: string
  Labels?: { id: string | number; name: string }[]
  // IssueProjectField (the shared "Project" column renderer) requires `id` to render
  // anything other than a placeholder dash — it uses it to build the project link.
  Project?: {
    id?: string | number
    OrganizationId?: string | number
    name?: string
    ProgrammingLanguages?: { id: string | number; name: string }[]
  }
  createdAt: string
}

export type BountiesTableProps = {
  issues: { data: BountyRow[]; completed: boolean }
  onViewDetails: (row: BountyRow) => void
}

const messages = defineMessages({
  viewDetails: {
    id: 'profile.bountiesTable.actions.viewDetails',
    defaultMessage: 'View details'
  },
  viewOnGitHub: {
    id: 'profile.bountiesTable.actions.viewOnGitHub',
    defaultMessage: 'View on GitHub'
  },
  copyLink: {
    id: 'profile.bountiesTable.actions.copyLink',
    defaultMessage: 'Copy link'
  }
})

const BountiesTable = ({ issues, onViewDetails }: BountiesTableProps) => {
  const intl = useIntl()
  const issueMetadata = useIssueMetadata({ includeProject: true })

  const tableHeaderMetadata = {
    ...issueMetadata,
    actions: { label: '', sortable: false, dataBaseKey: 'id' }
  }

  const renderer = {
    ...customColumnRenderer,
    actions: (item: BountyRow) => (
      <ActionsMenu
        actions={[
          {
            children: (
              <Typography variant="body2">{intl.formatMessage(messages.viewDetails)}</Typography>
            ),
            icon: <ViewDetailsIcon fontSize="small" />,
            onClick: () => onViewDetails(item)
          },
          {
            children: (
              <Typography variant="body2">{intl.formatMessage(messages.viewOnGitHub)}</Typography>
            ),
            icon: <GitHubIcon fontSize="small" />,
            onClick: () => item.url && window.open(item.url, '_blank', 'noreferrer')
          },
          {
            children: (
              <Typography variant="body2">{intl.formatMessage(messages.copyLink)}</Typography>
            ),
            icon: <CopyLinkIcon fontSize="small" />,
            onClick: () => item.url && navigator.clipboard.writeText(item.url)
          }
        ]}
      />
    )
  }

  return (
    <SectionTable
      tableData={issues}
      tableHeaderMetadata={tableHeaderMetadata}
      customColumnRenderer={renderer}
      transparent
    />
  )
}

export default BountiesTable
