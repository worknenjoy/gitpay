import React from 'react'
import ChecklistCard from 'design-library/molecules/cards/checklist-card/checklist-card'

type Requirement = {
  label: React.ReactNode
  done: boolean
}

type RequirementListProps = {
  requirements: Requirement[]
  completed?: boolean
}

const RequirementList = ({ requirements, completed }: RequirementListProps) => (
  <ChecklistCard
    completed={completed}
    items={requirements.map((requirement) => ({
      label: requirement.label,
      state: requirement.done ? 'checked' : 'failed'
    }))}
  />
)

export default RequirementList
