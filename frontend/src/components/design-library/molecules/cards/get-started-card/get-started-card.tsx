import React from 'react'
import { FormattedMessage } from 'react-intl'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'
import ChecklistProgress from 'design-library/molecules/data-display/checklist-progress/checklist-progress'
import { ChecklistCardItem } from 'design-library/molecules/cards/checklist-card/checklist-card'

export type GetStartedCardProps = {
  progress: { completed: number; total: number }
  items: ChecklistCardItem[]
  /** completed === false -> renders the loading state */
  completed?: boolean
}

// Every role dashboard shows the same "Get started" checklist card — this is
// the one place that composition lives, instead of each dashboard repeating
// ChecklistCard + ChecklistProgress with its own near-duplicate title id.
const GetStartedCard = ({ progress, items, completed }: GetStartedCardProps) => (
  <ChecklistCard
    progress={
      <ChecklistProgress
        title={
          <FormattedMessage
            id="dashboard.checklist.getStarted.title"
            defaultMessage="Get started"
          />
        }
        completed={progress.completed}
        total={progress.total}
        loading={completed === false}
      />
    }
    items={items}
    completed={completed}
  />
)

export default GetStartedCard
