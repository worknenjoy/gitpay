import React, { useEffect } from 'react'
import MyOrganizationIssuesPrivatePage from 'design-library/pages/private-pages/organization-pages/my-organization-issues-private-page/my-organization-issues-private-page'
import { useParams } from 'react-router'

const MyOrganizationIssuesPage = ({
  user,
  organization,
  issues,
  listTasks,
  filterTasks,
  fetchOrganization,
}) => {
  const { filter, organization_id } = useParams<{ filter: string; organization_id: string }>()

  const getFilteredIssues = (filter) => {
    switch (filter) {
      case 'assigned':
        filterTasks('Assigns')
        break
      case 'createdbyme':
        filterTasks('userId')
        break
      case 'interested':
        filterTasks('assigned')
        break
      case 'supported':
        filterTasks('supported')
        break
      default:
        filterTasks('userId')
        break
    }
  }

  useEffect(() => {
    fetchOrganization(organization_id)
  }, [organization_id])

  useEffect(() => {
    listTasks({ organizationId: organization_id })
  }, [organization_id])

  useEffect(() => {
    getFilteredIssues(filter)
  }, [filter])

  return <MyOrganizationIssuesPrivatePage organization={organization} user={user} issues={issues} />
}
export default MyOrganizationIssuesPage
