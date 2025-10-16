import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import { Item, Root, RootCard } from './project-list-compact.styles'
import ProjectCard from 'design-library/molecules/cards/project-card/project-card'
import ProjectListCompactPlaceholder from './project-list-compact.placeholder'

export default function ProjectListCompact ({ projects }) {
  const { data, completed } = projects

  const hasOpenIssues = (project) => {
    const hasOpenTasks = project.Tasks.filter(t => t.status === 'open')
    return hasOpenTasks.length > 0
  }

  const projectsSort = (data) => {
    const projectWithOpenIssues = data.filter(p => hasOpenIssues(p))
    return projectWithOpenIssues.sort((a, b) => parseInt(b.Tasks.length) - parseInt(a.Tasks.length))
  }

  const projectSortMoreBounties = (data) => {
    return data.sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))
  }

  const projectBounties = (data) => {
    return data.map(task => task.value ? task.value : 0).reduce((prev, next) => parseInt(prev) + parseInt(next))
  }

  
  return (
    <Root>
      { completed ? projectSortMoreBounties(projectsSort(data)).map(project => {
        return (
          <Item key={project.id}>
            <ProjectCard project={project} completed={completed} />
          </Item>
        )
      }) : <ProjectListCompactPlaceholder /> }
    </Root>
  )
}
