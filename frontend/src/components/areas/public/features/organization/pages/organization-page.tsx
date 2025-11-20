import OrganizationPublicPage from 'design-library/pages/public-pages/organization-public-page/organization-public-page'
import React from 'react'
import { useParams } from 'react-router-dom'

const OrganizationPage = ({
  organization,
  issues,
  filterTasks,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
  fetchOrganization
}) => {
  const { organization_id } = useParams<{ organization_id: string }>()

  const listTasksWithOrganization = (params) => {
    listTasks({ ...params, organizationId: organization_id })
  }

  React.useEffect(() => {
    fetchOrganization(organization_id)
  }, [organization_id])

  React.useEffect(() => {
    listTasksWithOrganization({})
  }, [organization])

  return (
    <OrganizationPublicPage
      organization={organization}
      issues={issues}
      filterTasks={filterTasks}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      listLanguages={listLanguages}
      listTasks={listTasksWithOrganization}
    />
  )
}

export default OrganizationPage
