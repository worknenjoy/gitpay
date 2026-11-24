import React from 'react'
import { FormattedMessage, FormattedRelativeTime } from 'react-intl'
import {
  LockOutlined as PrivateIcon,
  VisibilityOutlined as PublicIcon,
  ExpandMore as ChevronIcon
} from '@mui/icons-material'
import logoGithub from 'images/github-logo-black.png'
import DetailsSection from 'design-library/molecules/data-display/details-section/details-section'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import PullRequestIcon from 'design-library/atoms/icons/pull-request-icon/pull-request-icon'
import { PrIcon } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu.styles'
import type { LinkedPullRequest } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu'
import IssueSidebarCardBase from '../issue-sidebar-card-base/issue-sidebar-card-base'
import { Who, OpenDot, LinkedRow, LinkedToggle, LinkedList, LinkedItem } from './issue-github-card.styles'

export type IssueGithubCardInfo = {
  status: 'open' | 'closed'
  repoPrivate: boolean
  author?: { name: string; avatarUrl?: string }
  assignees?: { name: string; avatarUrl?: string }[]
  comments?: number
  updatedAt?: string
  url?: string
}

type IssueGithubCardProps = {
  info: IssueGithubCardInfo
  linkedPullRequests?: LinkedPullRequest[]
  linkedOpen?: boolean
  completed?: boolean
}

const relative = (date: string) => {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 3600) return <FormattedRelativeTime value={Math.round(seconds / 60)} unit="minute" numeric="auto" />
  if (abs < 86400) return <FormattedRelativeTime value={Math.round(seconds / 3600)} unit="hour" numeric="auto" />
  if (abs < 86400 * 30) return <FormattedRelativeTime value={Math.round(seconds / 86400)} unit="day" numeric="auto" />
  return <FormattedRelativeTime value={Math.round(seconds / (86400 * 30))} unit="month" numeric="auto" />
}

/** What GitHub says about the issue. Rows without data are left out. */
const IssueGithubCard = ({
  info,
  linkedPullRequests = [],
  linkedOpen = false,
  completed = true
}: IssueGithubCardProps) => {
  const [open, setOpen] = React.useState(linkedOpen)
  const assignees = info.assignees || []

  const items = [
    {
      label: <FormattedMessage id="issue.github.status" defaultMessage="Status" />,
      value: (
        <Who>
          <OpenDot data-closed={info.status === 'closed'} />
          {info.status === 'closed' ? (
            <FormattedMessage id="issue.github.closed" defaultMessage="Closed" />
          ) : (
            <FormattedMessage id="issue.github.open" defaultMessage="Open" />
          )}
        </Who>
      )
    },
    {
      label: <FormattedMessage id="issue.github.repoType" defaultMessage="Repository type" />,
      value: (
        <Who>
          {info.repoPrivate ? <PrivateIcon sx={{ fontSize: 14 }} /> : <PublicIcon sx={{ fontSize: 14 }} />}
          {info.repoPrivate ? (
            <FormattedMessage id="issue.github.private" defaultMessage="Private" />
          ) : (
            <FormattedMessage id="issue.github.public" defaultMessage="Public" />
          )}
        </Who>
      )
    },
    info.author && {
      label: <FormattedMessage id="issue.github.author" defaultMessage="Author" />,
      value: (
        <Who>
          <AvatarStack people={[info.author]} size="sm" withTooltip={false} />
          {info.author.name}
        </Who>
      )
    },
    assignees.length > 0 && {
      label: <FormattedMessage id="issue.github.assignees" defaultMessage="Assignees" />,
      value: (
        <Who>
          <AvatarStack people={assignees} size="sm" max={3} />
          {assignees.map((a) => a.name).join(', ')}
        </Who>
      )
    },
    typeof info.comments === 'number' && {
      label: <FormattedMessage id="issue.github.comments" defaultMessage="Comments" />,
      value: info.comments
    },
    info.updatedAt && {
      label: <FormattedMessage id="issue.github.updated" defaultMessage="Last updated" />,
      value: relative(info.updatedAt)
    }
  ].filter(Boolean) as { label: React.ReactNode; value: React.ReactNode }[]

  return (
    <IssueSidebarCardBase
      caption="GitHub"
      captionIcon={<img src={logoGithub} alt="" />}
      headerAction={
        info.url
          ? {
              label: <FormattedMessage id="issue.github.view" defaultMessage="View on GitHub" />,
              href: info.url
            }
          : undefined
      }
      completed={completed}
    >
      <DetailsSection items={items} />
      {linkedPullRequests.length > 0 && (
        <LinkedRow>
          <span>
            <FormattedMessage id="issue.github.linked" defaultMessage="Linked pull requests" />
          </span>
          <LinkedToggle type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
            {linkedPullRequests.length}
            <ChevronIcon fontSize="small" />
          </LinkedToggle>
          {open && (
            <LinkedList>
              {linkedPullRequests.map((pr) => (
                <LinkedItem key={pr.number}>
                  <PrIcon data-state={pr.state}>
                    <PullRequestIcon sx={{ fontSize: 13 }} />
                  </PrIcon>
                  <a href={pr.url} target="_blank" rel="noopener noreferrer">
                    <b>#{pr.number}</b> {pr.title}
                  </a>
                </LinkedItem>
              ))}
            </LinkedList>
          )}
        </LinkedRow>
      )}
    </IssueSidebarCardBase>
  )
}

export default IssueGithubCard
