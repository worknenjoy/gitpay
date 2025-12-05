import React, { useState, useEffect } from 'react'
import { Box, Grid, Pagination, Typography } from '@mui/material'
import { Root, StyledOrganizationCard } from './organization-list-full.styles'
import OrganizationListFullPlaceholder from './organization-list-full.placeholder'
import { FormattedMessage } from 'react-intl'

const paginate = (array, pageSize, pageNumber) => {
  return array && array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

const OrganizationList = ({ organizations }) => {
  const { data, completed } = organizations
  const [currentOrganizations, setCurrentOrganizations] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const recordsPerPage = 12

  useEffect(() => {
    data && setTotal(data.length)
    changePage()
  }, [data])

  const handlePagination = (e, value) => {
    setPage(value)
    changePage()
  }

  const changePage = () => {
    setCurrentOrganizations(paginate(data, recordsPerPage, page))
  }

  const pages = Math.ceil(total / recordsPerPage)

  if (completed && total === 0) {
    return (
      <Root maxWidth={false}>
        <Box mt={3} mb={3} display="flex" justifyContent="center">
          <Typography variant="h6">
            <FormattedMessage id="noOrganizationsFound" defaultMessage="No organizations found." />
          </Typography>
        </Box>
      </Root>
    )
  }

  return completed ? (
    <Root maxWidth={false}>
      <Box mt={3} mb={3}>
        <Grid container spacing={3}>
          {currentOrganizations &&
            currentOrganizations.length &&
            currentOrganizations.map((organization) => (
              <Grid key={organization.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StyledOrganizationCard organization={organization} completed={completed} />
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
    </Root>
  ) : (
    <OrganizationListFullPlaceholder />
  )
}

export default OrganizationList
