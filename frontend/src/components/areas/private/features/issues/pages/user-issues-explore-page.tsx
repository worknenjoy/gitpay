import React, { useEffect } from 'react'
import ExploreIssuesPrivatePage from 'design-library/pages/private-pages/issues-pages/explore-issues-private-page/explore-issues-private-page'
import { useHistory } from 'react-router-dom'

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
  const history = useHistory()

  useEffect(() => {
    filterTasks({})
    listTasks({})
  }, [history.location.pathname])

  return (
    <ExploreIssuesPrivatePage
      filterTasks={filterTasks}
      listTasks={listTasks}
      issues={issues}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      listLanguages={listLanguages}
    />
  )
}

export default ExploreIssuesPage
