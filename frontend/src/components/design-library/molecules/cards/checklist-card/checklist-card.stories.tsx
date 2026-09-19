import React from 'react'
import ChecklistCard from './checklist-card'
import ChecklistProgress from '../../data-display/checklist-progress/checklist-progress'

const meta = {
  title: 'Design Library/Molecules/Cards/ChecklistCard',
  component: ChecklistCard
}

export default meta

const Template = (args) => <ChecklistCard {...args} />

const GET_STARTED_ITEMS = [
  { label: 'Account created', state: 'checked' as const },
  { label: 'GitHub account connected', state: 'checked' as const },
  { label: 'First issue claimed', state: 'checked' as const },
  { label: 'Payout account connected', state: 'empty' as const }
]

export const Default = Template.bind({})
Default.args = {
  items: GET_STARTED_ITEMS
}

export const GetStarted = Template.bind({})
GetStarted.args = {
  progress: <ChecklistProgress title="Get started" completed={3} total={4} />,
  items: GET_STARTED_ITEMS
}

const REQUIREMENTS_ITEMS = [
  { label: 'The bounty is available', state: 'checked' as const },
  { label: "You're connected to GitHub", state: 'checked' as const },
  { label: "You're the author of this Pull Request on GitHub", state: 'checked' as const },
  { label: 'The Pull Request / Merge Request was merged', state: 'failed' as const },
  { label: 'The issue is closed on GitHub', state: 'failed' as const },
  { label: 'The issue is referenced on the PR', state: 'checked' as const }
]

export const Requirements = Template.bind({})
Requirements.args = {
  items: REQUIREMENTS_ITEMS
}

export const Loading = Template.bind({})
Loading.args = {
  items: REQUIREMENTS_ITEMS,
  completed: false
}
