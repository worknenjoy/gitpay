import React from 'react'
import { useHistory } from 'react-router-dom'
import slugify from '@sindresorhus/slugify'
import { Chip, Typography } from '@mui/material'
import { GitHub as GitHubIcon } from '@mui/icons-material'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'

export type PullRequestRow = {
  id: string | number
  pullRequestURL: string
  isPRMerged: boolean
  isIssueClosed: boolean
  createdAt: string
  Task?: { id: string | number; title: string; url?: string; status?: string }
}

export type PullRequestsTableProps = {
  pullRequests: { data: PullRequestRow[]; completed: boolean }
}

const PullRequestLink = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
  >
    <GitHubIcon fontSize="small" />
    <Typography variant="body2" component="span" sx={{ maxWidth: 260 }} noWrap>
      {url}
    </Typography>
  </a>
)

const PullRequestStatus = ({ row }: { row: PullRequestRow }) => {
  if (row.isPRMerged) {
    return (
      <Chip
        size="small"
        label="Merged"
        sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
      />
    )
  }
  if (row.isIssueClosed) {
    return <Chip size="small" label="Closed" variant="outlined" />
  }
  return <Chip size="small" label="Open" color="secondary" />
}

const PullRequestTask = ({ task }: { task?: PullRequestRow['Task'] }) => {
  const history = useHistory()
  if (!task) return <>—</>
  const taskPath = `/task/${task.id}/${slugify(task.title || '')}`
  return (
    <a
      href={`/#${taskPath}`}
      style={{ cursor: 'pointer' }}
      onClick={(event) => {
        event.preventDefault()
        history.push(taskPath)
      }}
    >
      <Typography variant="body2" component="span" sx={{ maxWidth: 220 }} noWrap>
        {task.title}
      </Typography>
    </a>
  )
}

const tableHeaderMetadata = {
  pullRequestURL: { label: 'Pull request', sortable: false, dataBaseKey: 'pullRequestURL' },
  status: { label: 'Status', sortable: false, dataBaseKey: 'id' },
  task: { label: 'Task', sortable: false, dataBaseKey: 'id' },
  createdAt: { label: 'Created', sortable: false, dataBaseKey: 'createdAt' }
}

const customColumnRenderer = {
  pullRequestURL: (item: PullRequestRow) => <PullRequestLink url={item.pullRequestURL} />,
  status: (item: PullRequestRow) => <PullRequestStatus row={item} />,
  task: (item: PullRequestRow) => <PullRequestTask task={item.Task} />,
  createdAt: (item: PullRequestRow) => <CreatedField createdAt={item.createdAt} />
}

const PullRequestsTable = ({ pullRequests }: PullRequestsTableProps) => (
  <SectionTable
    tableData={pullRequests}
    tableHeaderMetadata={tableHeaderMetadata}
    customColumnRenderer={customColumnRenderer}
    transparent
  />
)

export default PullRequestsTable
