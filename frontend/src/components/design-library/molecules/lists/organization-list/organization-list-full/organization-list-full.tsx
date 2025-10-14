import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Pagination
} from '@mui/material'
import { Root, StyledOrganizationCard } from './organization-list-full.styles'

const paginate = (array, pageSize, pageNumber) => {
  return array && array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

const OrganizationList = ({ organizations }) => {
  const [currentOrganizations, setCurrentOrganizations] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const recordsPerPage = 12

  useEffect(() => {
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
    <Root maxWidth={ false }>
      <Box mt={ 3 } mb={ 3 }>
        <Grid container spacing={ 3 }>
          { currentOrganizations && currentOrganizations.length && currentOrganizations.map(organization => (
            <Grid key={ organization.id } size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StyledOrganizationCard organization={ organization } />
            </Grid>
          )) }
        </Grid>
      </Box>
      { total - 1 > recordsPerPage &&
        <Box mt={ 3 } mb={ 3 } display="flex" justifyContent="center">
          <Pagination
            color="primary"
            count={ pages }
            size="small"
            page={ page }
            onChange={ handlePagination }
          />
        </Box>
      }
    </Root>
  )
}

export default OrganizationList
