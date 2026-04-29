import React, { useState, useEffect } from 'react'
import { Box, Chip, Divider, Grid, Pagination, Typography } from '@mui/material'
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Root, StyledOrganizationCard } from './organization-list-full.styles'
import OrganizationListFullPlaceholder from './organization-list-full.placeholder'
import { FormattedMessage } from 'react-intl'

const countOpenIssues = (organizations) =>
  organizations.reduce(
    (sum, org) =>
      sum +
      (org.Projects || []).reduce(
        (s, p) => s + (p.Tasks || []).filter((t) => t.status === 'open').length,
        0
      ),
    0
  )

const countBounties = (organizations) =>
  organizations.reduce(
    (sum, org) =>
      sum +
      (org.Projects || []).reduce(
        (s, p) => s + (p.Tasks || []).reduce((b, t) => b + (t.value ? parseInt(t.value) : 0), 0),
        0
      ),
    0
  )

const countProjects = (organizations) =>
  organizations.reduce((sum, org) => sum + (org.Projects?.length ?? 0), 0)

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

  const totalProjects = countProjects(data ?? [])
  const totalOpen = countOpenIssues(data ?? [])
  const totalBounties = countBounties(data ?? [])

  return completed ? (
    <Root maxWidth={false}>
      <Box mt={3} mb={2} display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Chip
          icon={<CorporateFareOutlinedIcon />}
          label={`${total} organization${total !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
        />
        {totalProjects > 0 && (
          <Chip
            icon={<FolderOutlinedIcon />}
            label={`${totalProjects} project${totalProjects !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
        )}
        <Chip
          icon={<BugReportOutlinedIcon />}
          label={
            totalOpen > 0
              ? `${totalOpen} open issue${totalOpen !== 1 ? 's' : ''}`
              : 'no open issues'
          }
          size="small"
          variant="outlined"
          color={totalOpen > 0 ? 'warning' : 'default'}
        />
        {totalBounties > 0 && (
          <Chip
            icon={<AttachMoneyIcon />}
            label={`$${totalBounties} in bounties`}
            size="small"
            variant="outlined"
            color="success"
          />
        )}
      </Box>
      <Divider sx={{ mb: 1 }} />
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
