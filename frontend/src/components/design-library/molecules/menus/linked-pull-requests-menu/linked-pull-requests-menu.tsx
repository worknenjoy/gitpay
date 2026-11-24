import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ArrowDropDown as CaretIcon } from '@mui/icons-material'
import PullRequestIcon from 'design-library/atoms/icons/pull-request-icon/pull-request-icon'
import ActionsMenu from 'design-library/molecules/menus/actions-menu/actions-menu'
import { Chip, More, PrIcon } from './linked-pull-requests-menu.styles'

export type LinkedPullRequest = {
  number: number
  title: string
  state: 'open' | 'merged' | 'closed'
  url: string
}

type LinkedPullRequestsMenuProps = {
  pullRequests: LinkedPullRequest[]
  defaultOpen?: boolean
}

const STATE_LABEL = {
  open: <FormattedMessage id="linkedPr.state.open" defaultMessage="Open" />,
  merged: <FormattedMessage id="linkedPr.state.merged" defaultMessage="Merged" />,
  closed: <FormattedMessage id="linkedPr.state.closed" defaultMessage="Closed" />
}

/** "#3102 (+1)" chip that opens the list of pull requests linked to an issue. */
const LinkedPullRequestsMenu = ({ pullRequests, defaultOpen }: LinkedPullRequestsMenuProps) => {
  if (!pullRequests || pullRequests.length === 0) return null
  const [first, ...rest] = pullRequests

  return (
    <ActionsMenu
      align="left"
      menuWidth={340}
      defaultOpen={defaultOpen}
      renderTrigger={(props) => (
        <Chip
          type="button"
          onClick={props.onClick}
          aria-haspopup={props['aria-haspopup']}
          aria-expanded={props['aria-expanded']}
          data-state={first.state}
        >
          <PrIcon data-state={first.state}>
            <PullRequestIcon sx={{ fontSize: 14 }} />
          </PrIcon>
          <span>
            #{first.number}
            {rest.length > 0 && <More> (+{rest.length})</More>}
          </span>
          <CaretIcon fontSize="small" />
        </Chip>
      )}
      actions={pullRequests.map((pr) => ({
        children: (
          <span style={{ display: 'flex', gap: 6, minWidth: 0 }}>
            <b style={{ fontWeight: 500 }}>#{pr.number}</b>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pr.title}
            </span>
          </span>
        ),
        description: STATE_LABEL[pr.state],
        icon: (
          <PrIcon data-state={pr.state}>
            <PullRequestIcon sx={{ fontSize: 14 }} />
          </PrIcon>
        ),
        href: pr.url,
        onClick: () => {}
      }))}
    />
  )
}

export default LinkedPullRequestsMenu
