import React, { useEffect } from 'react'
import ExploreIssuesPrivatePage from 'design-library/pages/private-pages/issues-pages/explore-issues-private-page/explore-issues-private-page';


const ExploreIssuesPage = ({ 
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  user
}) => {

  useEffect(() => {
    listTasks({})
  }, [])

  return (
    <ExploreIssuesPrivatePage 
      filterTasks={filterTasks}
      listTasks={listTasks}
      issues={issues}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      listLanguages={listLanguages}
      user={user}
    />
  )
}

export default ExploreIssuesPage;
