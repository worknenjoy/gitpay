import React from 'react';
import IssueTable from 'design-library/molecules/tables/issue-table/issue-table';

const ExplorerIssuePublicPage = ({
  filterTasks,
  filteredTasks,
  listTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages
}) => {
  return (
    <IssueTable
      filterTasks={filterTasks}
      filteredTasks={filteredTasks}
      listTasks={listTasks}
      issues={issues}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      listLanguages={listLanguages}
    />
  );
}

export default ExplorerIssuePublicPage;
