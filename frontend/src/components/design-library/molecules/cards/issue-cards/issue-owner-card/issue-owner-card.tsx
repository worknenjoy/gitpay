import React from 'react'
import { FormattedMessage } from 'react-intl'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import AuthorTag from 'design-library/atoms/badges/author-tag/author-tag'
import DetailsSection from 'design-library/molecules/data-display/details-section/details-section'
import IssueSidebarCardBase from '../issue-sidebar-card-base/issue-sidebar-card-base'
import { Who, Name, Sub } from './issue-owner-card.styles'

export type IssueOwner = {
  name: string
  avatarUrl?: string
  kind: 'Organization' | 'User'
  since?: string | number
  verified?: boolean
  url?: string
}

export type IssueOwnerReputation = {
  bountiesPaid: number
  totalPaid: string
  openWithBounty: number
}

type IssueOwnerCardProps = {
  owner: IssueOwner
  /** Without reputation data the card isn't rendered. */
  reputation?: IssueOwnerReputation
  completed?: boolean
}

/** Reputation of the user or organization that imported the issue. */
const IssueOwnerCard = ({ owner, reputation, completed = true }: IssueOwnerCardProps) => {
  if (!reputation) return null

  return (
    <IssueSidebarCardBase
      caption={<FormattedMessage id="issue.owner.caption" defaultMessage="Issue owner" />}
      headerAction={
        owner.url
          ? {
              label: <FormattedMessage id="issue.owner.view" defaultMessage="View profile" />,
              href: owner.url
            }
          : undefined
      }
      completed={completed}
    >
      <Who>
        <AvatarStack people={[owner]} size="lg" withTooltip={false} />
        <span>
          <Name>{owner.name}</Name>
          <Sub>
            {owner.kind === 'Organization' ? (
              <FormattedMessage id="issue.owner.kind.org" defaultMessage="Organization" />
            ) : (
              <FormattedMessage id="issue.owner.kind.user" defaultMessage="User" />
            )}
            {owner.since && (
              <>
                {' · '}
                <FormattedMessage
                  id="issue.owner.since"
                  defaultMessage="on Gitpay since {year}"
                  values={{ year: owner.since }}
                />
              </>
            )}
          </Sub>
          {owner.verified && <AuthorTag variant="verified" />}
        </span>
      </Who>
      <DetailsSection
        items={[
          {
            label: (
              <FormattedMessage id="issue.owner.bountiesPaid" defaultMessage="Bounties paid" />
            ),
            value: reputation.bountiesPaid
          },
          {
            label: <FormattedMessage id="issue.owner.totalPaid" defaultMessage="Total paid" />,
            value: reputation.totalPaid,
            variant: 'emphasis'
          },
          {
            label: (
              <FormattedMessage
                id="issue.owner.openWithBounty"
                defaultMessage="Open issues with bounty"
              />
            ),
            value: reputation.openWithBounty
          }
        ]}
      />
    </IssueSidebarCardBase>
  )
}

export default IssueOwnerCard
