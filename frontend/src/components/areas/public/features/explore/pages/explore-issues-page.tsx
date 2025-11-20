import React, { useEffect } from 'react'
import ExplorerIssuePublicPage from 'design-library/pages/public-pages/explorer-public-page/explorer-issue-public-page/explorer-issue-public-page'

const ExploreIssuesPage = ({
  filterTasks,
  listTasks,
  issues,
  labels,
  languages,
  listLabels,
  listLanguages
}) => {
  useEffect(() => {
    filterTasks({})
    listTasks({})
  }, [])

  return (
    <>
      <ExplorerIssuePublicPage
        filterTasks={filterTasks}
        listTasks={listTasks}
        issues={issues}
        labels={labels}
        languages={languages}
        listLabels={listLabels}
        listLanguages={listLanguages}
      />
    </>
  )
}

export default ExploreIssuesPage
