import React from 'react'
import RequirementList from './requirement-list'

export default {
  title: 'Design Library/Molecules/Lists/RequirementList',
  component: RequirementList,
}

const Template = (args) => <RequirementList {...args} />

export const Default = Template.bind({})
Default.args = {
  requirements: [
    { id: 1, label: 'Requirement 1', done: true },
    { id: 2, label: 'Requirement 2', done: false },
    { id: 3, label: 'Requirement 3', done: true },
  ],
  completed: true,
}

export const Loading = Template.bind({})
Loading.args = {
  requirements: [
    { id: 1, label: 'Requirement 1', satisfied: true },
    { id: 2, label: 'Requirement 2', satisfied: false },
    { id: 3, label: 'Requirement 3', satisfied: true },
  ],
  completed: false,
}
