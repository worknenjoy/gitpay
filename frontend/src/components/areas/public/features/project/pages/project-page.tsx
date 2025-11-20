import React, { useEffect } from 'react'
import ProjectPublicPage from 'design-library/pages/public-pages/project-public-page/project-public-page'
import { useParams } from 'react-router-dom'

interface ProjectPageProps {
  project: any
  issues: any
  filterTasks: (filters: any) => void
  labels: any
  languages: any
  listLabels: () => void
  listLanguages: () => void
  listTasks: (filters: any) => void
  fetchProject: (id: string) => void
}

const ProjectPage = ({
  project,
  issues,
  filterTasks,
  labels,
  languages,
  listLabels,
  listLanguages,
  listTasks,
  fetchProject,
}: ProjectPageProps) => {
  const { project_id } = useParams<{ project_id: string }>()

  const listTasksWithProject = (params) => {
    listTasks({ ...params, projectId: project_id })
  }

  useEffect(() => {
    fetchProject(project_id)
  }, [project_id])

  useEffect(() => {
    listTasksWithProject({})
  }, [project])

  return (
    <ProjectPublicPage
      filterTasks={filterTasks}
      issues={issues}
      labels={labels}
      languages={languages}
      listLabels={listLabels}
      listLanguages={listLanguages}
      listTasks={listTasksWithProject}
      project={project}
    />
  )
}

export default ProjectPage
