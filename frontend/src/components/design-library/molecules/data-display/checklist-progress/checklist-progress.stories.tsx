import React from 'react'
import ChecklistProgress from './checklist-progress'

const meta = {
  title: 'Design Library/Molecules/DataDisplay/ChecklistProgress',
  component: ChecklistProgress,
  args: {
    title: 'Get started',
    completed: 3,
    total: 4
  }
}

export default meta

const Template = (args) => <ChecklistProgress {...args} />

export const Default = Template.bind({})
Default.args = {}

export const AllComplete = Template.bind({})
AllComplete.args = { completed: 4, total: 4 }

export const JustStarted = Template.bind({})
JustStarted.args = { completed: 0, total: 4 }

export const Loading = Template.bind({})
Loading.args = { loading: true }
