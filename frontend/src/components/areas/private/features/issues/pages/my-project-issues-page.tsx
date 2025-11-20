import React, { useEffect } from 'react'
import MyProjectIssuesPrivatePage from 'design-library/pages/private-pages/project-pages/my-project-issues-private-page/my-project-issues-private-page'
import { useHistory, useParams } from 'react-router'

const MyProjectIssuesPage = ({ user, project, issues, listTasks, filterTasks, fetchProject }) => {
  const history = useHistory()
  const { filter, project_id } = useParams<{ filter: string; project_id: string }>()

  const getFilteredIssues = (filter) => {
    switch (filter) {
      case 'assigned':
        filterTasks('Assigns')
        break
      case 'createdbyme':
        filterTasks('userId')
        break
      case 'interested':
        filterTasks('assigned')
        break
      case 'supported':
        filterTasks('supported')
        break
      default:
        filterTasks('userId')
        break
    }
  }

  useEffect(() => {
    fetchProject(project_id)
  }, [project_id])

  useEffect(() => {
    listTasks({ projectId: project_id })
  }, [project_id])

  useEffect(() => {
    getFilteredIssues(filter)
  }, [filter])

  return <MyProjectIssuesPrivatePage project={project} user={user} issues={issues} />
}
export default MyProjectIssuesPage
