import React from 'react'
import IssueFilter from './issue-filter'

export default {
  title: 'Design Library/Atoms/Filters/Issue',
  component: IssueFilter,
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = (args) => <IssueFilter {...args} />

const mockTasks = [
  { id: 1, value: '100', status: 'open', title: 'Task with bounty' },
  { id: 2, value: '0', status: 'open', title: 'Task without bounty' },
  { id: 3, value: '50', status: 'open', title: 'Another task with bounty' },
  { id: 4, value: '0', status: 'open', title: 'Another task without bounty' }
]

const mockFilterTasks = (key, value) => {
  console.log('Filter called with:', key, value)
  return Promise.resolve()
}

export const Default = Template.bind({})
Default.args = {
  tasks: mockTasks,
  filteredTasks: mockTasks,
  filterTasks: mockFilterTasks,
  baseUrl: '/tasks/'
}

export const WithBounties = Template.bind({})
WithBounties.args = {
  tasks: mockTasks,
  filteredTasks: mockTasks.filter((task) => parseFloat(task.value) > 0),
  filterTasks: mockFilterTasks,
  baseUrl: '/tasks/'
}

export const WithoutBounties = Template.bind({})
WithoutBounties.args = {
  tasks: mockTasks,
  filteredTasks: mockTasks.filter((task) => parseFloat(task.value) === 0),
  filterTasks: mockFilterTasks,
  baseUrl: '/tasks/'
}

export const ProfileExplore = Template.bind({})
ProfileExplore.args = {
  tasks: mockTasks,
  filteredTasks: mockTasks,
  filterTasks: mockFilterTasks,
  baseUrl: '/profile/explore/'
}
