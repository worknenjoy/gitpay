import React, { useEffect } from 'react'
import MyIssuesPrivatePage from 'design-library/pages/private-pages/issues-pages/my-issues-private-page/my-issues-private-page'
import { useParams } from 'react-router'

const MyIssuesPage = ({
  user,
  issues,
  listTasks,
  filterTasks
}) => {
  const { filter } = useParams<{ filter: string }>()

  const getFilteredIssues = (filter) => {
    switch (filter) {
      case 'assigned':
        filterTasks('assigned')
        break;
      case 'createdbyme':
        filterTasks('userId')
        break;
      case 'interested':
        filterTasks('Assigns')
        break;
      case 'supported':
        filterTasks('supported')
        break;
      default:
        filterTasks('userId')
        break;
    }
  }

  useEffect(() => {
    listTasks({})
  }, [])

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