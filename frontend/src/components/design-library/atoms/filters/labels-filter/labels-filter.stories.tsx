import React from 'react'
import LabelsFilter from './labels-filter'

export default {
  title: 'Design Library/Atoms/Filters/Labels',
  component: LabelsFilter
}

const Template = (args) => <LabelsFilter {...args} />

const mockLabels = {
  data: [
    { id: 1, name: 'bug' },
    { id: 2, name: 'enhancement' },
    { id: 3, name: 'documentation' },
    { id: 4, name: 'good first issue' },
    { id: 5, name: 'help wanted' }
  ]
}

const mockListLabels = () => {
  console.log('List labels called')
}

const mockListTasks = (filters) => {
  console.log('List tasks called with filters:', filters)
}

export const Default = Template.bind({})
Default.args = {
  labels: mockLabels,
  listLabels: mockListLabels,
  listTasks: mockListTasks
}

export const EmptyLabels = Template.bind({})
EmptyLabels.args = {
  labels: { data: [] },
  listLabels: mockListLabels,
  listTasks: mockListTasks
}

export const ManyLabels = Template.bind({})
ManyLabels.args = {
  labels: {
    data: [
      { id: 1, name: 'bug' },
      { id: 2, name: 'enhancement' },
      { id: 3, name: 'documentation' },
      { id: 4, name: 'good first issue' },
      { id: 5, name: 'help wanted' },
      { id: 6, name: 'frontend' },
      { id: 7, name: 'backend' },
      { id: 8, name: 'ui/ux' },
      { id: 9, name: 'performance' },
      { id: 10, name: 'testing' }
    ]
  },
  listLabels: mockListLabels,
  listTasks: mockListTasks
}
