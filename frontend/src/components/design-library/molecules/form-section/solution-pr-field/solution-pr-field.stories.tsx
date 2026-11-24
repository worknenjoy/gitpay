import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SolutionPrField from './solution-pr-field'

const ControlledField = (args: any) => {
  const [value, setValue] = React.useState(args.value)
  return (
    <div style={{ maxWidth: 600, minHeight: 420 }}>
      <SolutionPrField {...args} value={value} onChange={setValue} />
    </div>
  )
}

const meta: Meta<typeof SolutionPrField> = {
  title: 'Design Library/Molecules/FormSection/SolutionPrField',
  component: SolutionPrField,
  parameters: { layout: 'padded' },
  render: (args: any) => <ControlledField {...args} />
}

export default meta
type Story = StoryObj<typeof SolutionPrField>

const myPullRequests = [
  {
    repo: 'RetroShare/RetroShare',
    number: 3102,
    title: 'Boards: stick posts to the top of the feed',
    when: 'merged 2 days ago',
    state: 'merged' as const,
    note: 'Mentions #3094'
  },
  {
    repo: 'RetroShare/RetroShare',
    number: 3090,
    title: 'Sort boards by pinned posts first',
    when: 'merged 1 week ago',
    state: 'merged' as const
  },
  {
    repo: 'RetroShare/RetroShare',
    number: 3098,
    title: 'Use createPostV2 in PostedCreatePostDialog',
    when: '1 week ago',
    state: 'open' as const,
    note: 'Mentions #3094'
  },
  {
    repo: 'RetroShare/libretroshare',
    number: 231,
    title: 'Admin can edit posts in boards',
    when: '2 weeks ago',
    state: 'open' as const
  }
]

export const PlainInput: Story = { args: { value: '', onChange: () => {} } }

export const NotConnected: Story = {
  args: { value: '', onChange: () => {}, onConnect: () => {} }
}

export const Connected: Story = {
  args: {
    value: 'https://github.com/RetroShare/RetroShare/pull/3102',
    onChange: () => {},
    connectedAs: 'alexanmtz',
    myPullRequests
  }
}

export const PickingPullRequests: Story = {
  args: { ...Connected.args, value: '', defaultMenuOpen: true }
}
