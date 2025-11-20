import React from 'react'
import ProjectListFull from './project-list-full'

export default {
  title: 'Design Library/Molecules/Lists/Projects/ProjectListFull',
  component: ProjectListFull,
}

const hundredProjects = Array.from({ length: 102 }, (_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  description: `Description for project ${i + 1}`,
  Organization: { name: `Org ${i + 1}`, provider: i % 2 === 0 ? 'GitHub' : 'GitLab' },
  Tasks: Array.from({ length: (i % 5) + 1 }, (_, j) => ({
    status: j % 2 === 0 ? 'open' : 'closed',
    value: j % 3 === 0 ? (j + 1) * 10 : undefined,
  })),
}))

export const ProjectListStory = (args) => <ProjectListFull {...args} />
ProjectListStory.args = {
  projects: {
    completed: true,
    data: hundredProjects,
  },
}

export const LoadingState = (args) => <ProjectListFull {...args} />
LoadingState.args = {
  projects: {
    completed: false,
    data: [],
  },
}
