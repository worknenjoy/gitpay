import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from '@mui/material'
import Breadcrumb from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import ProjectIssuesTable from 'design-library/molecules/tables/project-issue-table/project-issue-table'

const ProjectPublicPage = ({
  project,
  issues,
  filterTasks,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
}) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumb
        project={project}
        root={{
          label: <FormattedMessage id="breadcrumb.explore.issues.root" defaultMessage="Explore" />,
          link: '/explore/issues',
        }}
      />
      <ContextTitle
        context={project}
        title={<FormattedMessage id="project.title" defaultMessage="Project" />}
      />
      <ProjectIssuesTable
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

export default ProjectPublicPage
