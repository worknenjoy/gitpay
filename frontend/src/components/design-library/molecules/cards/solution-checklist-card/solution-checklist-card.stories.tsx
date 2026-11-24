import type { Meta, StoryObj } from '@storybook/react'
import SolutionChecklistCard from './solution-checklist-card'

const meta: Meta<typeof SolutionChecklistCard> = {
  title: 'Design Library/Molecules/Cards/SolutionChecklistCard',
  component: SolutionChecklistCard,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof SolutionChecklistCard>

export const Ready: Story = {
  args: {
    items: [
      { id: 'bounty', state: 'checked' },
      { id: 'connected', state: 'checked' },
      { id: 'author', state: 'checked' },
      { id: 'merged', state: 'checked' },
      { id: 'issueClosed', state: 'checked' },
      { id: 'referenced', state: 'checked' }
    ]
  }
}

export const NotMergedNoBounty: Story = {
  args: {
    items: [
      { id: 'bounty', state: 'warning' },
      { id: 'connected', state: 'checked' },
      { id: 'author', state: 'checked' },
      { id: 'merged', state: 'warning' },
      { id: 'issueClosed', state: 'failed' },
      { id: 'referenced', state: 'checked' }
    ]
  }
}

export const NothingChecked: Story = {
  args: {
    items: [
      { id: 'bounty', state: 'checked' },
      { id: 'connected', state: 'failed' },
      { id: 'author', state: 'failed' },
      { id: 'merged', state: 'failed' },
      { id: 'issueClosed', state: 'failed' },
      { id: 'referenced', state: 'failed' }
    ]
  }
}

export const Loading: Story = { args: { ...Ready.args, completed: false } }
