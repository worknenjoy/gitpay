import React from 'react'
import IssueFilter from './issue-filter-bar'

export default {
  title: 'Design Library/Molecules/Sections/IssueFilterBar',
  component: IssueFilter,
  parameters: {
    layout: 'fullscreen',
  },
}

const Template = (args) => <IssueFilter {...args} />

export const Default = Template.bind({})
Default.args = {
  filterTasks: () => Promise.resolve(),
  baseUrl: '/tasks/',
  tasks: [
    { id: 1, title: 'Fix bug in authentication', value: '50' },
    { id: 2, title: 'Add new feature to dashboard', value: '0' },
    { id: 3, title: 'Improve documentation', value: '20' },
    { id: 4, title: 'Refactor codebase', value: '0' },
    { id: 5, title: 'Optimize performance', value: '100' },
  ],
  filteredTasks: [],
  labels: {
    completed: true,
    data: [
      { id: 1, name: 'bug' },
      { id: 2, name: 'documentation' },
      { id: 3, name: 'enhancement' },
      { id: 4, name: 'good first issue' },
      { id: 5, name: 'help wanted' },
    ],
  },
  listLabels: () => Promise.resolve(),
  listTasks: () => Promise.resolve(),
  languages: {
    completed: true,
    data: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Python' },
      { id: 3, name: 'Java' },
      { id: 4, name: 'C#' },
      { id: 5, name: 'Ruby' },
    ],
  },
  listLanguages: () => Promise.resolve(),
}
