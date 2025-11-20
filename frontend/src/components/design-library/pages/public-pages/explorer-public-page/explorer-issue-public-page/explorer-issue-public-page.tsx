import React from 'react'
import IssueTable from 'design-library/molecules/tables/issue-table/issue-table'

const ExplorerIssuePublicPage = ({
  listTasks,
  filterTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages
}) => {
  return (
    <IssueTable
      listTasks={listTasks}
      issues={issues}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      filterTasks={filterTasks}
      listLanguages={listLanguages}
    />
  )
}

export default ExplorerIssuePublicPage
