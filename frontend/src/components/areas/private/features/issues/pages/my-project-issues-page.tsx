import React, { useEffect, useCallback } from 'react'
import MyProjectIssuesPrivatePage from 'design-library/pages/private-pages/project-pages/my-project-issues-private-page/my-project-issues-private-page'
import { useHistory, useParams } from 'react-router'

const TAB_TO_PARAM: Record<string, string> = {
  createdbyme: 'userId',
  assigned: 'assignedTo',
  interested: 'interestedUserId',
  supported: 'supportedByUserId'
}

const DEFAULT_ROWS_PER_PAGE = 10

const MyProjectIssuesPage = ({ user, project, issues, listTasks, fetchProject }) => {
  const history = useHistory()
  const { filter, project_id } = useParams<{ filter: string; project_id: string }>()
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
        projectId: project_id,
        [paramKey]: userId,
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, filter, page, rowsPerPage, currentSort, listTasks, project_id]
  )

  useEffect(() => {
    fetchProject(project_id)
  }, [project_id])

  useEffect(() => {
    if (userId) {
      setPage(0)
      fetchIssues(0, rowsPerPage, {})
    }
  }, [userId, project_id])

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
    <MyProjectIssuesPrivatePage
      project={project}
      user={user}
      issues={issues}
      serverSidePagination={serverSidePagination}
    />
  )
}
export default MyProjectIssuesPage
