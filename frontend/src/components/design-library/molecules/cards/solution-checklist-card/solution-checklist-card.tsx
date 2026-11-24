import React from 'react'
import { FormattedMessage } from 'react-intl'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'
import type { CheckListItemState } from 'design-library/atoms/data-display/check-list-item/check-list-item'

export type SolutionCheckId =
  | 'bounty'
  | 'connected'
  | 'author'
  | 'merged'
  | 'issueClosed'
  | 'referenced'

export type SolutionCheckItem = {
  id: SolutionCheckId
  state: Extract<CheckListItemState, 'checked' | 'failed' | 'warning'>
}

type SolutionChecklistCardProps = {
  items: SolutionCheckItem[]
  completed?: boolean
}

const LABELS: Record<
  SolutionCheckId,
  Partial<Record<SolutionCheckItem['state'], React.ReactNode>> & { default: React.ReactNode }
> = {
  bounty: {
    default: (
      <FormattedMessage id="solutionCheck.bounty" defaultMessage="The bounty is available" />
    ),
    warning: (
      <FormattedMessage
        id="solutionCheck.bounty.none"
        defaultMessage="No bounty yet · you can request payment below"
      />
    )
  },
  connected: {
    default: (
      <FormattedMessage id="solutionCheck.connected" defaultMessage="You're connected to GitHub" />
    )
  },
  author: {
    default: (
      <FormattedMessage
        id="solutionCheck.author"
        defaultMessage="You're the author of this pull request on GitHub"
      />
    )
  },
  merged: {
    default: (
      <FormattedMessage id="solutionCheck.merged" defaultMessage="The pull request was merged" />
    ),
    warning: (
      <FormattedMessage
        id="solutionCheck.merged.pending"
        defaultMessage="The pull request is not merged yet · payment releases on merge"
      />
    )
  },
  issueClosed: {
    default: (
      <FormattedMessage
        id="solutionCheck.issueClosed"
        defaultMessage="The issue is closed on GitHub"
      />
    )
  },
  referenced: {
    default: (
      <FormattedMessage
        id="solutionCheck.referenced"
        defaultMessage="The issue is referenced in the pull request"
      />
    )
  }
}

/** The requirements a pull request must meet before it can be sent as a paid solution. */
const SolutionChecklistCard = ({ items, completed = true }: SolutionChecklistCardProps) => (
  <ChecklistCard
    completed={completed}
    items={items.map((item) => ({
      id: item.id,
      state: item.state,
      label: LABELS[item.id][item.state] || LABELS[item.id].default
    }))}
  />
)

export default SolutionChecklistCard
