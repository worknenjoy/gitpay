import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Pagination
} from '@mui/material'
import { styled } from '@mui/material/styles'
import OrganizationCard from './organization-card'

const Root = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
  minHeight: '100%',
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(3)
}))

const StyledOrganizationCard = styled(OrganizationCard)({
  height: '100%'
})

const paginate = (array, pageSize, pageNumber) => {
  return array && array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

const OrganizationList = ({ listOrganizations, organizations }) => {
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
    <Root maxWidth={ false }>
      <Box mt={ 3 } mb={ 3 }>
        <Grid container spacing={ 3 }>
          { currentOrganizations && currentOrganizations.length && currentOrganizations.map(organization => (
            <Grid item key={ organization.id } xs={ 12 } md={ 6 } lg={ 4 }>
              <StyledOrganizationCard organization={ organization } />
            </Grid>
          )) }
        </Grid>
      </Box>
      { total - 1 > recordsPerPage &&
        <Box mt={ 3 } mb={ 3 } display='flex' justifyContent='center'>
          <Pagination
            color='primary'
            count={ pages }
            size='small'
            page={ page }
            onChange={ handlePagination }
          />
        </Box>
      }
    </Root>
  )
}

export default OrganizationList
