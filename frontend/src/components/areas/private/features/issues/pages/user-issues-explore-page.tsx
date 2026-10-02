import React, { useEffect, useState } from 'react'
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
  user,
  createTask
}) => {
  const history = useHistory()
  const [openAddIssue, setOpenAddIssue] = useState(false)

  useEffect(() => {
    filterTasks({})
    listTasks({ page: 0, limit: 10 })
  }, [history.location.pathname])

  const handleCreateIssue = async (data) => {
    await createTask(data, history)
    setOpenAddIssue(false)
  }

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
      openAddIssue={openAddIssue}
      onAddIssueClick={() => setOpenAddIssue(true)}
      onCloseAddIssue={() => setOpenAddIssue(false)}
      onCreateIssue={handleCreateIssue}
      onViewPaymentRequests={() => history.push('/profile/payment-requests')}
    />
  )
}

export default ExploreIssuesPage
