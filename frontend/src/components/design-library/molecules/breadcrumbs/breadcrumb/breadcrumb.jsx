import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from '@material-ui/core/Link'
import { Breadcrumbs, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  breadcrumbRoot: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  breadcrumbLink: {
    textDecoration: 'underline'
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  button: {
    width: 100,
    font: 10
  },
  gutterRight: {
    marginRight: 10
  }
}))


export const Breadcrumb = ({ task, user, project, organization }) => {
  const classes = useStyles()
  const history = useHistory()
  const isProfile = history.location.pathname.includes('profile')
  const breadcrumbPathPrefix = isProfile ? '/profile/' : '/'
  const { data , completed } = task
  const taskUser = data?.User
  const breadcrumbProject = data?.Project || project?.data
  const breadcrumbOrganization = breadcrumbProject?.Organization || organization

  const handleBackToTaskList = (e) => {
    e.preventDefault()
    history.push(breadcrumbPathPrefix + 'explore')
  }

  return (
    
      <div className={classes.breadcrumbRoot}>
          <Breadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon />} fontSize='small'>
            { (user?.id && user?.id === taskUser?.id) ? (
              <Link href={'/#/profile/tasks/createdbyme'} color='inherit'>
                <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                  <FormattedMessage id='task.title.navigation.user' defaultMessage='Your issues' />
                </Typography>
              </Link>
            ) : (
              <Link href={`/#${breadcrumbPathPrefix}tasks/all`} color='inherit' onClick={handleBackToTaskList}>
                <Typography variant='subtitle2' className={classes.breadcrumbLink}>
                  <FormattedMessage id='task.title.navigation' defaultMessage='All issues' />
                </Typography>
              </Link>
            )}
            { breadcrumbProject?.id && (
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
  )

}