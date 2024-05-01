import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from '@material-ui/core/Link'
import { Breadcrumbs, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ReactPlaceholder from 'react-placeholder'

export const Breadcrumb = ({ history, task, classes, user, project, organization }) => {
  const breadcrumbPathPrefix = user?.id ? '/profile/' : '/'
  const { data , completed } = task
  const taskUser = data?.User
  const breadcrumbProject = data?.Project || project?.data
  const breadcrumbOrganization = breadcrumbProject?.Organization || organization

  const handleBackToTaskList = (e) => {
    e.preventDefault()
    history.push('/profile/tasks/all')
  }

  return (
    <ReactPlaceholder showLoadingAnimation type='text' rows={1}
      ready={true}>
      <div className={classes.breadcrumbRoot}>
          <Breadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon />} fontSize='small'>
            {user && user?.id && user?.id === taskUser?.id ? (
              <Link href={'/#/profile/tasks/createdbyme'} color='inherit'>
                <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                  <FormattedMessage id='task.title.navigation.user' defaultMessage='Your issues' />
                </Typography>
              </Link>
            ) : (
              <Link href='/#/profile/tasks/all' color='inherit' onClick={handleBackToTaskList}>
                <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                  <FormattedMessage id='task.title.navigation' defaultMessage='All issues' />
                </Typography>
              </Link>
            )}
            {(data || project) && !organization && (
            <Link href={'/#' + breadcrumbPathPrefix + 'organizations/' + breadcrumbOrganization?.id} color='inherit'>
              <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                {breadcrumbOrganization?.name}
              </Typography>
            </Link>
            )}
            {data && (
              <Link href={`/#${breadcrumbPathPrefix}organizations/${breadcrumbProject?.id}/projects/${data?.Project?.id}`} className={classes.breadcrumb} color='inherit'>
                <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                  {breadcrumbProject?.name}
                </Typography>
              </Link>
            ) }
            <Typography variant='subtitle2'>
              ...
            </Typography>
          </Breadcrumbs>
      </div>
    </ReactPlaceholder>
  )

}