import React, { useEffect } from 'react'
import MyIssuesPrivatePage from 'design-library/pages/private-pages/issues-pages/my-issues-private-page/my-issues-private-page'
import { useHistory, useParams } from 'react-router'

const MyIssuesPage = ({
  user,
  issues,
  listTasks,
  filterTasks
}) => {
  const history = useHistory()
  const { filter } = useParams<{ filter: string }>()

  const getFilteredIssues = (filter) => {
    switch (filter) {
      case 'assigned':
        filterTasks('Assigns')
        break;
      case 'createdbyme':
        filterTasks('userId')
        break;
      case 'interested':
        filterTasks('assigned')
        break;
      default:
        filterTasks('userId')
        break;
    }
  }

  useEffect(() => {
    listTasks({})
    return () => {
      filterTasks({})
    }
  }, [history.location.pathname])

  useEffect(() => {
    getFilteredIssues(filter)
  }, [filter])

  return (
    <MyIssuesPrivatePage
      user={user}
      issues={issues}
    />
  )
}
export default MyIssuesPage