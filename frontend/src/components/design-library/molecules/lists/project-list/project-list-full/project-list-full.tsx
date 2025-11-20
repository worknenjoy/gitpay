import React, { useState, useEffect } from 'react'
import { Box, Grid, Pagination } from '@mui/material'
import { StyledContainer, StyledProjectCard } from './project-list-full.styles'
import ProjectListFullPlaceholder from './project-list-full.placeholder'

const paginate = (array, pageSize, pageNumber) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array && array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

const ProjectListFull = ({ projects }) => {
  const { data, completed } = projects
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [currentProjects, setCurrentProjects] = useState([])
  const recordsPerPage = 12

  useEffect(() => {
    setTotal(filter(projects.data).length)
    changePage()
  }, [projects.data])

  const handlePagination = (e, value) => {
    setPage(value)
    changePage()
  }

  const hasOpenIssues = (project) => {
    const hasOpenTasks = project.Tasks.filter((t) => t.status === 'open')
    return hasOpenTasks.length > 0
  }

  const projectsSort = (data) => {
    const projectWithOpenIssues = data.filter((p) => hasOpenIssues(p))
    return projectWithOpenIssues.sort((a, b) => parseInt(b.Tasks.length) - parseInt(a.Tasks.length))
  }

  const projectSortMoreBounties = (data) => {
    return data.sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))
  }

  const projectBounties = (data) => {
    return data
      .map((task) => (task.value ? task.value : 0))
      .reduce((prev, next) => parseInt(prev) + parseInt(next))
  }

  const filter = (data) => {
    return projectSortMoreBounties(projectsSort(data))
  }

  const changePage = () => {
    setCurrentProjects(paginate(filter(data), recordsPerPage, page))
  }

  const pages = Math.ceil(total / recordsPerPage)

  return completed ? (
    <StyledContainer maxWidth={false}>
      <Box mt={3} mb={3}>
        <Grid container spacing={3}>
          {currentProjects.map((p) => (
            <Grid key={p.id} size={{ lg: 4, md: 6, xs: 12 }}>
              <StyledProjectCard project={p} completed={completed} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {total - 1 > recordsPerPage && (
        <Box mt={3} mb={3} display="flex" justifyContent="center">
          <Pagination
            color="primary"
            count={pages}
            size="small"
            page={page}
            onChange={handlePagination}
          />
        </Box>
      )}
    </StyledContainer>
  ) : (
    <ProjectListFullPlaceholder />
  )
}

export default ProjectListFull
