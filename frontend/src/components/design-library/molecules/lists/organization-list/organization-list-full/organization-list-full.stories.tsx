import React from 'react'
import OrganizationListFull from './organization-list-full'

export default {
  title: 'Design Library/Molecules/Lists/Organizations/OrganizationListFull',
  component: OrganizationListFull
}

const hundredOrganizations = Array.from({ length: 102 }, (_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  description: `Description for project ${i + 1}`,
  Projects: Array.from({ length: (i % 5) + 1 }, (_, j) => ({
    id: j + 1,
    name: `Project ${j + 1}`
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
