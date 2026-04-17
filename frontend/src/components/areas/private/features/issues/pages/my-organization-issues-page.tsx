import React, { useEffect, useCallback } from 'react'
import MyOrganizationIssuesPrivatePage from 'design-library/pages/private-pages/organization-pages/my-organization-issues-private-page/my-organization-issues-private-page'
import { useParams } from 'react-router'

const TAB_TO_PARAM: Record<string, string> = {
  createdbyme: 'userId',
  assigned: 'assignedTo',
  interested: 'interestedUserId',
  supported: 'supportedByUserId'
}

const DEFAULT_ROWS_PER_PAGE = 10

const MyOrganizationIssuesPage = ({
  user,
  organization,
  issues,
  listTasks,
  fetchOrganization
}) => {
  const { filter, organization_id } = useParams<{ filter: string; organization_id: string }>()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [currentSort, setCurrentSort] = React.useState<{ sortBy?: string; sortDirection?: string }>(
    {}
  )

  const userId = user?.data?.id

  const fetchIssues = useCallback(
    (pageOverride?: number, rowsOverride?: number, sortOverride?: typeof currentSort, filterOverride?: string) => {
      if (!userId) return
      const activePage = pageOverride ?? page
      const activeRows = rowsOverride ?? rowsPerPage
      const activeSort = sortOverride ?? currentSort
      const activeFilter = filterOverride ?? filter
      const paramKey = TAB_TO_PARAM[activeFilter] ?? 'userId'
      listTasks({
        organizationId: organization_id,
        [paramKey]: userId,
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, filter, page, rowsPerPage, currentSort, listTasks, organization_id]
  )

  useEffect(() => {
    fetchOrganization(organization_id)
  }, [organization_id])

  useEffect(() => {
    if (userId) {
      setPage(0)
      fetchIssues(0, rowsPerPage, {})
    }
  }, [userId, organization_id])

  useEffect(() => {
    if (userId) {
      setPage(0)
      setCurrentSort({})
      fetchIssues(0, rowsPerPage, {}, filter)
    }
  }, [filter])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchIssues(newPage, rowsPerPage, currentSort)
    },
    [fetchIssues, rowsPerPage, currentSort]
  )

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      fetchIssues(0, newRowsPerPage, currentSort)
    },
    [fetchIssues, currentSort]
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: 'asc' | 'desc' | 'none') => {
      const newSort = sortDirection === 'none' ? {} : { sortBy, sortDirection }
      setCurrentSort(newSort)
      setPage(0)
      fetchIssues(0, rowsPerPage, newSort)
    },
    [fetchIssues, rowsPerPage]
  )

  const serverSidePagination = {
    enabled: true,
    totalCount: issues.totalCount ?? 0,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onSortChange: handleSortChange
  }

  return (
    <MyOrganizationIssuesPrivatePage
      organization={organization}
      user={user}
      issues={issues}
      serverSidePagination={serverSidePagination}
    />
  )
}
export default MyOrganizationIssuesPage
