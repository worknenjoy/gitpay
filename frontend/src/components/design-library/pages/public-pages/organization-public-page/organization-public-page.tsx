import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container } from '@mui/material';
import Breadcrumb from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb';
import ContextTitle from 'design-library/atoms/typography/context-title/context-title';
import IssuesTable from 'design-library/molecules/tables/issue-table/issue-table';
import ProjectListCompact from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact';

const OrganizationPublicPage = ({
  organization,
  issues,
  filterTasks,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
  listProjects = () => {}
}) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumb
        organization={organization}
      />
      <ContextTitle
        context={organization}
        title={<FormattedMessage id="organization.title" defaultMessage="Organization" />}
      />
      <ProjectListCompact
        projects={{data: organization.data.Projects}}
        listProjects={listProjects}
      />
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
  );
};

export default OrganizationPublicPage;