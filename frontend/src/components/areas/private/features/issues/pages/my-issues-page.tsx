import React, { useEffect, useCallback } from 'react'
import MyIssuesPrivatePage from 'design-library/pages/private-pages/issues-pages/my-issues-private-page/my-issues-private-page'
import { useParams } from 'react-router'

const TAB_TO_PARAM: Record<string, string> = {
  createdbyme: 'userId',
  assigned: 'assignedTo',
  interested: 'interestedUserId',
  supported: 'supportedByUserId'
}

const DEFAULT_ROWS_PER_PAGE = 10

const MyIssuesPage = ({ user, issues, listTasks }) => {
  const { filter } = useParams<{ filter: string }>()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [currentSort, setCurrentSort] = React.useState<{ sortBy?: string; sortDirection?: string }>(
    {}
  )

  // getCurrentUser returns state.loggedIn = { data: { id, ... }, logged, ... }
  const userId = user?.data?.id

  const fetchIssues = useCallback(
    (pageOverride?: number, rowsOverride?: number, sortOverride?: typeof currentSort) => {
      if (!userId) return
      const activePage = pageOverride ?? page
      const activeRows = rowsOverride ?? rowsPerPage
      const activeSort = sortOverride ?? currentSort
      const paramKey = TAB_TO_PARAM[filter] ?? 'userId'
      listTasks({
        [paramKey]: userId,
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, filter, page, rowsPerPage, currentSort, listTasks]
  )

  // Fetch when user ID becomes available
  useEffect(() => {
    if (userId) {
      setPage(0)
      fetchIssues(0, rowsPerPage, {})
    }
  }, [userId])

  // Fetch on tab change, reset pagination
  useEffect(() => {
    if (userId) {
      setPage(0)
      setCurrentSort({})
      fetchIssues(0, rowsPerPage, {})
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
    <MyIssuesPrivatePage user={user} issues={issues} serverSidePagination={serverSidePagination} />
  )
}

export default MyIssuesPage
