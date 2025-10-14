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

  const { completed, data } = user || {}

  useEffect(() => {
    listTasks({ userId: data?.id })
  }, [user])

  useEffect(() => {
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
  }, [filter])

  return (
    <MyIssuesPrivatePage
      user={user}
      issues={issues}
    />
  )
}
export default MyIssuesPage