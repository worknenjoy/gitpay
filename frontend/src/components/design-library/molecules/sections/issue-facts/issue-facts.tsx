import React from 'react'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import { Link } from '@mui/material'
import FactsStrip, { Fact } from 'design-library/molecules/sections/facts-strip/facts-strip'
import IssueStateStatus from 'design-library/atoms/status/issue-state-status/issue-state-status'
import IssueVisibilityMenu, {
  IssueVisibility
} from 'design-library/molecules/menus/issue-visibility-menu/issue-visibility-menu'

export type IssueFactsDeadline = {
  date: string
  daysLeft: number
  overdue: boolean
}

type IssueFactsProps = {
  state?: string | null
  visibility: IssueVisibility
  /** Owners can change visibility. Omit for read-only. */
  onVisibilityChange?: (value: IssueVisibility) => void
  deadline?: IssueFactsDeadline
  /** Owners can set / edit the deadline. Without a deadline it shows "Set deadline". */
  onDeadlineClick?: () => void
  completed?: boolean
  defaultVisibilityOpen?: boolean
}

/** State · Visibility · Deadline strip at the top of the issue page rail. */
const IssueFacts = ({
  state,
  visibility,
  onVisibilityChange,
  deadline,
  onDeadlineClick,
  completed = true,
  defaultVisibilityOpen
}: IssueFactsProps) => {
  const intl = useIntl()

  const facts: Fact[] = [
    {
      label: intl.formatMessage({ id: 'issue.facts.state', defaultMessage: 'State' }),
      help: intl.formatMessage({
        id: 'issue.facts.state.help',
        defaultMessage:
          'Where the issue is on Gitpay. Created: no bounty yet. Funded: money is held for the contributor.'
      }),
      value: <IssueStateStatus state={state || 'created'} />
    },
    {
      label: intl.formatMessage({ id: 'issue.facts.visibility', defaultMessage: 'Visibility' }),
      help: intl.formatMessage({
        id: 'issue.facts.visibility.help',
        defaultMessage:
          'Public issues appear in Explore and search. Not listed issues are hidden from both, but anyone with the link can still open them.'
      }),
      value: (
        <IssueVisibilityMenu
          value={visibility}
          onChange={onVisibilityChange}
          defaultOpen={defaultVisibilityOpen}
        />
      )
    }
  ]

  if (deadline || onDeadlineClick) {
    const dateNode = deadline ? (
      <FormattedDate value={deadline.date} month="short" day="numeric" year="numeric" />
    ) : (
      <FormattedMessage id="task.deadline.call" defaultMessage="Set deadline" />
    )
    facts.push({
      label: intl.formatMessage({ id: 'issue.facts.deadline', defaultMessage: 'Deadline' }),
      help: intl.formatMessage({
        id: 'issue.facts.deadline.help',
        defaultMessage:
          'The date the issue owner needs a solution by. After it, funding closes and unclaimed bounties are refunded.'
      }),
      value: onDeadlineClick ? (
        <Link component="button" type="button" onClick={onDeadlineClick} sx={{ fontSize: 13.5 }}>
          {dateNode}
        </Link>
      ) : (
        dateNode
      ),
      sub:
        deadline &&
        (deadline.overdue ? (
          <FormattedMessage id="task.dealine.past" defaultMessage="Overdue" />
        ) : (
          <FormattedMessage
            id="issue.facts.deadline.left"
            defaultMessage="{days, plural, =0 {Due today} one {# day left} other {# days left}}"
            values={{ days: deadline.daysLeft }}
          />
        ))
    })
  }

  return <FactsStrip facts={facts} completed={completed} />
}

export default IssueFacts
