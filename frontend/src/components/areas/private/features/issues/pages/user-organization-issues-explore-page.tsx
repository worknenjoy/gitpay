import React, { useEffect } from 'react'
import ExploreOrganizationPage from 'design-library/pages/private-pages/organization-pages/explore-organization-issues-private-page/explore-organization-issues-private-page'
import { useParams } from 'react-router-dom'

const DEFAULT_ROWS_PER_PAGE = 10

const UserOrganizationIssuesExplorePage = ({
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  fetchOrganization,
  user,
  organization
}) => {
  const { organization_id } = useParams<{ organization_id: string }>()

  const listTasksWithOrganization = (params) => {
    listTasks({ ...params, organizationId: organization_id })
  }

  useEffect(() => {
    fetchOrganization(organization_id)
  }, [organization_id])

  useEffect(() => {
    listTasksWithOrganization({ page: 0, limit: DEFAULT_ROWS_PER_PAGE })
  }, [organization_id])

  return (
    <ExploreOrganizationPage
      organization={organization}
      filterTasks={filterTasks}
      listTasks={listTasksWithOrganization}
      issues={issues}
      labels={labels}
      listLabels={listLabels}
      languages={languages}
      listLanguages={listLanguages}
      user={user}
      defaultRowsPerPage={DEFAULT_ROWS_PER_PAGE}
    />
  )
}

export default UserOrganizationIssuesExplorePage
