import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import ProjectCard from './project-card'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  projectCard: {
    height: '100%'
  }
}))

const paginate = (array, pageSize, pageNumber) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array && array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

const ProjectList = ({ listProjects, projects }) => {
  const classes = useStyles()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [currentProjects, setCurrentProjects] = useState([])
  const recordsPerPage = 12

  useEffect(() => {
    listProjects && listProjects()
    setTotal(filter(projects.data).length)
    changePage()
  }, [projects.data])

  const handlePagination = (e, value) => {
    setPage(value)
    changePage()
  }

  const hasOpenIssues = (project) => {
    const hasOpenTasks = project.Tasks.filter(t => t.status === 'open')
    return hasOpenTasks.length > 0
  }

  const projectsSort = (data) => {
    const projectWithOpenIssues = data.filter(p => hasOpenIssues(p))
    return projectWithOpenIssues.sort((a, b) => parseInt(b.Tasks.length) - parseInt(a.Tasks.length))
  }

  const projectSortMoreBounties = (data) => {
    return data.sort((a, b) => projectBounties(b.Tasks) - projectBounties(a.Tasks))
  }

  const projectBounties = (data) => {
    return data.map(task => task.value ? task.value : 0).reduce((prev, next) => parseInt(prev) + parseInt(next))
  }

  const filter = (data) => {
    return projectSortMoreBounties(projectsSort(data))
  }

  const changePage = () => {
    setCurrentProjects(paginate(filter(projects.data), recordsPerPage, page))
  }

  const pages = Math.ceil(total / recordsPerPage)

  return (
    <Container maxWidth={ false }>
      <Box mt={ 3 } mb={ 3 }>
        <Grid
          container
          spacing={ 3 }
        >
          { currentProjects && currentProjects.length > 0 && currentProjects
            .map(project => (
              <Grid
                item
                key={ project.id }
                lg={ 4 }
                md={ 6 }
                xs={ 12 }
              >
                <ProjectCard
                  className={ classes.projectCard }
                  project={ project }
                />
              </Grid>
            )) }
        </Grid>
      </Box>
      { total - 1 > recordsPerPage &&
      <Box
        mt={ 3 }
        mb={ 3 }
        display='flex'
        justifyContent='center'
      >
        <Pagination
          color='primary'
          count={ pages }
          size='small'
          page={ page } onChange={ handlePagination }
        />
      </Box>
      }
    </Container>
  )
}

export default ProjectList
