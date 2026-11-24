import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { Link } from '@mui/material'
import ListCardRow from 'design-library/molecules/cards/list-card/list-card-row'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import SolutionStatus from 'design-library/atoms/status/solution-status/solution-status'
import SolutionPayoutStatus, {
  SolutionPayoutStatusValue
} from 'design-library/atoms/status/solution-payout-status/solution-payout-status'
import EmptySolutions from 'design-library/molecules/content/empty/empty-solutions/empty-solutions'
import { List, Tags } from './issue-solutions-list.styles'

export type IssueSolution = {
  id: number | string
  author: { name: string; avatarUrl?: string }
  pullRequest: { number?: number; title: string; url: string; state: 'open' | 'merged' | 'closed' }
  sentAt?: string
  payout?: SolutionPayoutStatusValue
}

type IssueSolutionsListProps = {
  solutions: IssueSolution[]
  onSendSolution?: () => void
}

/** Pull requests sent as solutions for an issue, with their merge and payout state. */
const IssueSolutionsList = ({ solutions, onSendSolution }: IssueSolutionsListProps) => {
  if (!solutions || solutions.length === 0) {
    return <EmptySolutions onActionClick={onSendSolution} />
  }

  return (
    <List>
      {solutions.map((solution) => (
        <ListCardRow
          key={solution.id}
          leading={<AvatarStack people={[solution.author]} withTooltip={false} />}
          title={<b style={{ fontWeight: 500 }}>{solution.pullRequest.title}</b>}
          meta={[
            <Link
              key="pr"
              href={solution.pullRequest.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {solution.pullRequest.number ? `#${solution.pullRequest.number}` : 'PR'}
            </Link>,
            <FormattedMessage
              key="by"
              id="issueSolutions.by"
              defaultMessage="by {name}"
              values={{ name: solution.author.name }}
            />,
            solution.sentAt && (
              <FormattedMessage
                key="sent"
                id="issueSolutions.sent"
                defaultMessage="sent {date}"
                values={{
                  date: <FormattedDate value={solution.sentAt} month="short" day="numeric" />
                }}
              />
            )
          ]}
          status={
            <Tags>
              <SolutionStatus status={solution.pullRequest.state} />
              {solution.payout && <SolutionPayoutStatus status={solution.payout} />}
            </Tags>
          }
        />
      ))}
    </List>
  )
}

export default IssueSolutionsList
