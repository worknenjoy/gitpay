import React, { useEffect } from 'react'
import ProjectListFull from 'design-library/molecules/lists/project-list/project-list-full/project-list-full'

const ExploreProjectsPage = ({ listProjects, projects }) => {
  useEffect(() => {
    listProjects()
  }, [])

  return (
    <>
      <ProjectListFull projects={projects} />
    </>
  )
}

export default ExploreProjectsPage
