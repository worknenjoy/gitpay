import React from 'react'
import OrganizationListFull from './organization-list-full'

export default {
  title: 'Design Library/Molecules/Lists/Organizations/OrganizationListFull',
  component: OrganizationListFull
}

const randomTasks = (seed: number) =>
  Array.from({ length: (seed % 6) + 1 }, (_, i) => ({
    id: seed * 10 + i,
    status: i % 3 === 0 ? 'closed' : 'open',
    value: i % 2 === 0 ? (seed % 4 + 1) * 25 : 0
  }))

const hundredOrganizations = Array.from({ length: 102 }, (_, i) => ({
  id: i + 1,
  name: `Organization ${i + 1}`,
  description: `Description for organization ${i + 1}`,
  provider: i % 2 === 0 ? 'github' : 'bitbucket',
  Projects: Array.from({ length: (i % 5) + 1 }, (_, j) => ({
    id: i * 10 + j + 1,
    name: `Project ${j + 1}`,
    Tasks: randomTasks(i + j)
  })),
  User: {
    id: i + 1,
    username: `user${i + 1}`,
    name: `User ${i + 1}`
  }
}))

export const Default = (args) => <OrganizationListFull {...args} />
Default.args = {
  organizations: {
    completed: true,
    data: hundredOrganizations
  }
}

export const Loading = (args) => <OrganizationListFull {...args} />
Loading.args = {
  organizations: {
    completed: false,
    data: []
  }
}

export const Empty = (args) => <OrganizationListFull {...args} />
Empty.args = {
  organizations: {
    completed: true,
    data: []
  }
}
