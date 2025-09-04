import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from '@mui/material/Link'
import { Breadcrumbs, Typography, Skeleton } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { styled } from '@mui/material/styles'
import { BreadcrumbRoot, BreadcrumbLink } from './breadcrumb.styles'
import { useHistory } from 'react-router-dom'

export const Breadcrumb = ({ task, user, project, organization }) => {
  const history = useHistory()
  const isProfile = history.location.pathname.includes('profile')
  const breadcrumbPathPrefix = isProfile ? '/profile/' : '/'
  const { data, completed } = task
  const taskUser = data?.User
  const breadcrumbProject = data?.Project || project?.data
  const breadcrumbOrganization = breadcrumbProject?.Organization || organization
  const { completed: projectCompleted } = project || {}
  const { completed: organizationCompleted } = organization || {}

  const handleBackToTaskList = (e) => {
    e.preventDefault()
    history.push(isProfile ? `${breadcrumbPathPrefix}explore` : `${breadcrumbPathPrefix}tasks/open`)
  }

  return (
    completed || projectCompleted || organizationCompleted ?
    <BreadcrumbRoot>
      <Breadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon />} fontSize='small'>
        {(user?.id && user?.id === taskUser?.id) ? (
          <Link href={'/#/profile/tasks/createdbyme'} color='inherit'>
            <Typography variant='subtitle2' component={BreadcrumbLink}>
              <FormattedMessage id='task.title.navigation.user' defaultMessage='Your issues' />
            </Typography>
          </Link>
        ) : (
          <Link href={`/#${breadcrumbPathPrefix}tasks/all`} color='inherit' onClick={handleBackToTaskList}>
            <Typography variant='subtitle2' component={BreadcrumbLink}>
              <FormattedMessage id='task.title.navigation' defaultMessage='All issues' />
            </Typography>
          </Link>
        )}
        {breadcrumbProject?.id && (

          <Link href={'/#' + breadcrumbPathPrefix + 'organizations/' + breadcrumbOrganization?.id} color='inherit'>
            <Typography variant='subtitle2' component={BreadcrumbLink}>
              {breadcrumbOrganization?.name}
            </Typography>
          </Link>

        )}
        {data && (
          <Link href={`/#${breadcrumbPathPrefix}organizations/${breadcrumbProject?.id}/projects/${data?.Project?.id}`} color='inherit'>
            <Typography variant='subtitle2' component={BreadcrumbLink}>
              {breadcrumbProject?.name}
            </Typography>
          </Link>
        )}
        <Typography variant='subtitle2'>
          ...
        </Typography>
      </Breadcrumbs>
    </BreadcrumbRoot> : <Skeleton variant='text' />
  )

}