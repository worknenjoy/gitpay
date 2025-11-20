import React from 'react'
import { Breadcrumb } from './breadcrumb'

export default {
  title: 'Design Library/Molecules/Breadcrumbs/Breadcrumb',
  component: Breadcrumb,
}

const Template = (args) => <Breadcrumb {...args} />

export const Default = Template.bind({})
Default.args = {
  task: {
    completed: true,
    data: {
      id: 1,
      title: 'Task 1',
      User: { id: 1, username: 'User 1' },
      Project: {
        id: 1,
        name: 'Project 1',
        Organization: { id: 1, name: 'Organization 1' },
      },
    },
  },
}

export const CustomRoot = Template.bind({})
CustomRoot.args = {
  task: {
    completed: true,
    data: {
      id: 1,
      title: 'Task 1',
      User: { id: 1, username: 'User 1' },
      Project: {
        id: 1,
        name: 'Project 1',
        Organization: { id: 1, name: 'Organization 1' },
      },
    },
  },
  root: {
    label: 'Dashboard',
    link: '/dashboard',
  },
}

export const ProjectOnly = Template.bind({})
ProjectOnly.args = {
  project: {
    completed: true,
    data: {
      id: 1,
      name: 'Project 1',
      Organization: { id: 1, name: 'Organization 1' },
    },
  },
}

export const OrganizationOnly = Template.bind({})
OrganizationOnly.args = {
  organization: {
    completed: true,
    data: {
      id: 1,
      name: 'Organization 1',
    },
  },
}

export const rootOnly = Template.bind({})
rootOnly.args = {
  root: {
    label: 'Dashboard',
    link: '/dashboard',
  },
}

export const Loading = Template.bind({})
Loading.args = {
  task: {
    completed: false,
    data: {},
  },
  project: {
    completed: false,
    data: {},
  },
  organization: {
    completed: false,
    data: {},
  },
}
