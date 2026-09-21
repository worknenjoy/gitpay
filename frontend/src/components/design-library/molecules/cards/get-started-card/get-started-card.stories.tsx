import React from 'react'
import GetStartedCard from './get-started-card'

const meta = {
  title: 'Design Library/Molecules/Cards/GetStartedCard',
  component: GetStartedCard
}

export default meta

const Template = (args) => <GetStartedCard {...args} />

export const Default = Template.bind({})
Default.args = {
  progress: { completed: 3, total: 4 },
  items: [
    { label: 'Account created', state: 'checked' },
    { label: 'GitHub account connected', state: 'checked' },
    { label: 'First issue claimed', state: 'checked' },
    { label: 'Payout account connected', state: 'empty' }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  progress: { completed: 0, total: 4 },
  items: Default.args.items,
  completed: false
}
