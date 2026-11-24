import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  HowToReg as ContributorIcon,
  CreditCard as SponsorIcon,
  GitHub as GitHubIcon,
  ChevronRight as ChevronIcon
} from '@mui/icons-material'
import TaskInvite from '../../../dialogs/issue-invite-dialog/issue-invite-dialog'
import IssueSidebarCardBase from '../issue-sidebar-card-base/issue-sidebar-card-base'
import { Row, RowIcon, RowText } from './issue-invite-card.styles'

type IssueInviteCardProps = {
  id: number
  onInvite: (...args: any[]) => void
  onFunding: () => void
  user: any
  /** Comment on the provider issue with a link to this page. Row hidden without it. */
  onPostOnGithub?: () => void
}

/** "Share with others": invite a contributor or a sponsor, or post the issue on GitHub. */
export default function IssueInviteCard({
  id,
  onInvite,
  onFunding,
  user,
  onPostOnGithub
}: IssueInviteCardProps) {
  const [dialogContributorOpen, setDialogContributorOpen] = useState(false)

  const rows = [
    {
      key: 'contributor',
      icon: <ContributorIcon />,
      title: (
        <FormattedMessage
          id="task.invite.card.button.contributor"
          defaultMessage="Invite contributor"
        />
      ),
      description: (
        <FormattedMessage
          id="task.invite.card.contributor.description"
          defaultMessage="Ask a developer to work on this issue"
        />
      ),
      onClick: () => setDialogContributorOpen(true)
    },
    {
      key: 'sponsor',
      icon: <SponsorIcon />,
      title: (
        <FormattedMessage id="task.invite.card.button.sponsor" defaultMessage="Invite sponsor" />
      ),
      description: (
        <FormattedMessage
          id="task.invite.card.sponsor.description"
          defaultMessage="Ask someone to add to the bounty"
        />
      ),
      onClick: onFunding
    },
    onPostOnGithub && {
      key: 'github',
      icon: <GitHubIcon />,
      title: <FormattedMessage id="task.invite.card.github" defaultMessage="Post on GitHub" />,
      description: (
        <FormattedMessage
          id="task.invite.card.github.description"
          defaultMessage="Comment on the GitHub issue with a link to this page"
        />
      ),
      onClick: onPostOnGithub
    }
  ].filter(Boolean) as {
    key: string
    icon: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
    onClick: () => void
  }[]

  return (
    <>
      <IssueSidebarCardBase
        dense
        caption={
          <FormattedMessage id="task.invite.card.title.share" defaultMessage="Share with others" />
        }
      >
        <div>
          {rows.map((row) => (
            <Row key={row.key} type="button" onClick={row.onClick}>
              <RowIcon>{row.icon}</RowIcon>
              <RowText>
                <b>{row.title}</b>
                <em>{row.description}</em>
              </RowText>
              <ChevronIcon fontSize="small" />
            </Row>
          ))}
        </div>
      </IssueSidebarCardBase>
      <TaskInvite
        visible={dialogContributorOpen}
        onClose={(e) => {
          e?.preventDefault?.()
          setDialogContributorOpen(false)
        }}
        onInvite={onInvite}
        user={user}
        id={id}
      />
    </>
  )
}
