import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from '@mui/material'
import Breadcrumb from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import IssuesTable from 'design-library/molecules/tables/issue-table/issue-table'
import ProjectListCompact from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact'

const OrganizationPublicPage = ({
  organization,
  issues,
  filterTasks,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
}) => {
  const { data, completed } = organization
  const projectList = { data: data?.Projects || [], completed }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumb
        organization={organization}
        root={{
          label: (
            <FormattedMessage id="breadcrumb.explore.organizations.root" defaultMessage="Explore" />
          ),
          link: '/explore/issues',
        }}
      />
      <ContextTitle
        context={organization}
        title={<FormattedMessage id="organization.title" defaultMessage="Organization" />}
      />
      <ProjectListCompact projects={projectList} />
      <IssuesTable
        issues={issues}
        filterTasks={filterTasks}
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
        listTasks={listTasks}
      />
    </Container>
  )
}

export default OrganizationPublicPage
