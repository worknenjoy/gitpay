import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import LanguageFilter from './languages-filter'

export default {
  title: 'Design Library/Atoms/Filters/Languages',
  component: LanguageFilter,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
}

const Template = (args) => <LanguageFilter {...args} />

const mockLanguages = {
  data: [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Python' },
    { id: 4, name: 'Java' },
    { id: 5, name: 'React' },
    { id: 6, name: 'Node.js' }
  ]
}

const mockListLanguages = () => {
  console.log('List languages called')
}

const mockListTasks = (filters) => {
  console.log('List tasks called with filters:', filters)
}

export const Default = Template.bind({})
Default.args = {
  languages: mockLanguages,
  listLanguages: mockListLanguages,
  listTasks: mockListTasks
}

export const EmptyLanguages = Template.bind({})
EmptyLanguages.args = {
  languages: { data: [] },
  listLanguages: mockListLanguages,
  listTasks: mockListTasks
}

export const ManyLanguages = Template.bind({})
ManyLanguages.args = {
  languages: {
    data: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'Python' },
      { id: 4, name: 'Java' },
      { id: 5, name: 'React' },
      { id: 6, name: 'Node.js' },
      { id: 7, name: 'Vue.js' },
      { id: 8, name: 'Angular' },
      { id: 9, name: 'C++' },
      { id: 10, name: 'Go' },
      { id: 11, name: 'Rust' },
      { id: 12, name: 'PHP' }
    ]
  },
  listLanguages: mockListLanguages,
  listTasks: mockListTasks
}
