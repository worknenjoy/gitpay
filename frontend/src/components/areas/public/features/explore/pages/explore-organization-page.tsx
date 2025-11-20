import React, { useEffect } from 'react'
import OrganizationsListFull from 'design-library/molecules/lists/organization-list/organization-list-full/organization-list-full'

const ExploreOrganizationPage = ({ organizations, listOrganizations }) => {
  useEffect(() => {
    listOrganizations?.()
  }, [])

  return <OrganizationsListFull organizations={organizations} />
}

export default ExploreOrganizationPage
