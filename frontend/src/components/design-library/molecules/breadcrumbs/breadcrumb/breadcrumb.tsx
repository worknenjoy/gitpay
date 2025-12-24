import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Breadcrumbs, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { BreadcrumbRoot, BreadcrumbLink } from './breadcrumb.styles'
import { Link, useHistory } from 'react-router-dom'
import BreadcrumbPlaceholder from './breadcrumb.placeholder'

type BreadcrumbRootItem = {
  label: any
  link?: string
}

type BreadcrumbProps = {
  task?: any
  project?: any
  organization?: any
  root?: BreadcrumbRootItem
}

export const Breadcrumb = ({ task, project, organization, root }: BreadcrumbProps) => {
  const history = useHistory()
  const isProfile = history.location.pathname.includes('/profile')
  const isExplore = history.location.pathname.includes('/explore')
  let breadcrumbPathPrefix = isProfile ? '/profile/' : '/'
  breadcrumbPathPrefix = isExplore ? `${breadcrumbPathPrefix}explore/` : breadcrumbPathPrefix
  const { data = {}, completed } = task || {}
  const breadcrumbProject = data?.Project || project?.data || {}
  const breadcrumbOrganization = breadcrumbProject?.Organization || organization?.data || {}
  const { completed: projectCompleted } = project || {}
  const { completed: organizationCompleted } = organization || {}

  const isReady = (task && project && organization) ? 
    projectCompleted || organizationCompleted || completed : true

  return isReady ? (
    <BreadcrumbRoot>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
        {root ? (
          root.link ? (
            <Link to={root.link}>
              <Typography variant="subtitle2" component={BreadcrumbLink}>
                {root.label}
              </Typography>
            </Link>
          ) : (
            <Typography variant="subtitle2">{root.label}</Typography>
          )
        ) : (
          <Link to={'/'}>
            <Typography variant="subtitle2" component={BreadcrumbLink}>
              <FormattedMessage id="breadcrumbs.root" defaultMessage="Home" />
            </Typography>
          </Link>
        )}
        {breadcrumbProject?.id && (
          <Link to={`${breadcrumbPathPrefix}organizations/${breadcrumbOrganization?.id}`}>
            <Typography variant="subtitle2" component={BreadcrumbLink}>
              {breadcrumbOrganization?.name}
            </Typography>
          </Link>
        )}
        {breadcrumbProject?.id && !data.id && (
          <Typography variant="subtitle2">{breadcrumbProject?.name}</Typography>
        )}
        {breadcrumbOrganization?.id && !breadcrumbProject?.id && (
          <Typography variant="subtitle2">{breadcrumbOrganization?.name}</Typography>
        )}
        {data.id && (
          <Link
            to={`${breadcrumbPathPrefix}organizations/${breadcrumbProject?.id}/projects/${data?.Project?.id}`}
          >
            <Typography variant="subtitle2" component={BreadcrumbLink}>
              {breadcrumbProject?.name}
            </Typography>
          </Link>
        )}
        <Typography variant="subtitle2">...</Typography>
      </Breadcrumbs>
    </BreadcrumbRoot>
  ) : (
    <BreadcrumbPlaceholder />
  )
}

export default Breadcrumb
