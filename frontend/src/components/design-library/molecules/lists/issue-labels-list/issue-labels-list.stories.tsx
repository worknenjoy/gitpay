import React from 'react'
import IssueLabelsList from './issue-labels-list'

export default {
  title: 'Design Library/Molecules/Lists/IssueLabelsList',
  component: IssueLabelsList
}

const Template = (args) => <IssueLabelsList {...args} />

export const Default = Template.bind({})
Default.args = {
  labels: [
    { id: 1, name: 'bug', color: '#d73a4a' },
    { id: 2, name: 'enhancement', color: '#a2eeef' },
    { id: 3, name: 'documentation', color: '#0075ca' }
  ],
  completed: true
}

export const Loading = Template.bind({})
Loading.args = {
  labels: [],
  completed: false
}

export const Empty = Template.bind({})
Empty.args = {
  labels: [],
  completed: true
}
