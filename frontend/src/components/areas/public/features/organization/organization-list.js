import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  styled
} from '@mui/material'
import { Pagination } from '@mui/lab'
import OrganizationCard from './organization-card'
import Skeleton from '@mui/material/Skeleton'

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

const OrganizationList = ({ listOrganizations, organizations }) => {
  const classes = useStyles()
  const [currentOrganizations, setCurrentOrganizations] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const recordsPerPage = 12

  useEffect(() => {
    listOrganizations && listOrganizations()
    organizations.data && setTotal(organizations.data.length)
    changePage()
  }, [organizations.data])

  const handlePagination = (e, value) => {
    setPage(value)
    changePage()
  }

  const changePage = () => {
    setCurrentOrganizations(paginate(organizations.data, recordsPerPage, page))
  }

  const pages = Math.ceil(total / recordsPerPage)

  return (
    <Container maxWidth={ false }>
      <Box mt={ 3 } mb={ 3 }>
        <Grid
          container
          spacing={ 3 }
        >
          { currentOrganizations && currentOrganizations.length && currentOrganizations.map(organization => (
            <Grid
              item
              key={ organization.id }
              lg={ 4 }
              md={ 6 }
              xs={ 12 }
            >
              <OrganizationCard
                className={ classes.projectCard }
                organization={ organization }
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

export default OrganizationList
