import React, { useEffect } from 'react'
import ExploreProjectPage from 'design-library/pages/private-pages/project-pages/explore-project-issues-private-page/explore-project-issues-private-page'
import { useParams } from 'react-router-dom'

const UserProjectIssuesExplorePage = ({
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  fetchProject,
  project
}) => {
  const { project_id } = useParams<{ project_id: string }>()

  const listTasksWithProject = (params) => {
    listTasks({ ...params, projectId: project_id })
  }

  useEffect(() => {
    fetchProject(project_id)
  }, [project_id])

  useEffect(() => {
    listTasksWithProject({ projectId: project_id })
  }, [project_id])

  return (
    <ExploreProjectPage
      project={project}
      filterTasks={filterTasks}
      listTasks={listTasksWithProject}
      issues={issues}
      labels={labels}
      listLabels={listLabels}
      languages={languages}
      listLanguages={listLanguages}
    />
  )
}

export default UserProjectIssuesExplorePage
