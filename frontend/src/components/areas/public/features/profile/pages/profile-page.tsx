import UserProfilePublicPage from 'design-library/pages/public-pages/user-profile-public-page/user-profile-public-page'
import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

const TAB_TO_PARAM: Record<string, string> = {
  created: 'userId',
  supported: 'supportedByUserId'
}

const DEFAULT_ROWS_PER_PAGE = 10

const ProfilePage = ({ user, searchUser, tasks, listTasks }) => {
  const { userId } = useParams<{ userId: string }>()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [currentSort, setCurrentSort] = React.useState<{ sortBy?: string; sortDirection?: string }>(
    {}
  )
  const [currentTab, setCurrentTab] = React.useState('created')

  const fetchIssues = useCallback(
    (
      tabOverride?: string,
      pageOverride?: number,
      rowsOverride?: number,
      sortOverride?: typeof currentSort
    ) => {
      const activeTab = tabOverride ?? currentTab
      const activePage = pageOverride ?? page
      const activeRows = rowsOverride ?? rowsPerPage
      const activeSort = sortOverride ?? currentSort
      const paramKey = TAB_TO_PARAM[activeTab] ?? 'userId'
      listTasks({
        [paramKey]: userId,
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, currentTab, page, rowsPerPage, currentSort, listTasks]
  )

  useEffect(() => {
    if (userId) {
      searchUser({ id: userId })
      fetchIssues()
    }
  }, [userId])

  const handleTabChange = useCallback(
    (newTab: string) => {
      setCurrentTab(newTab)
      setPage(0)
      setCurrentSort({})
      fetchIssues(newTab, 0, rowsPerPage, {})
    },
    [fetchIssues, rowsPerPage]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchIssues(currentTab, newPage, rowsPerPage, currentSort)
    },
    [fetchIssues, currentTab, rowsPerPage, currentSort]
  )

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      fetchIssues(currentTab, 0, newRowsPerPage, currentSort)
    },
    [fetchIssues, currentTab, currentSort]
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: 'asc' | 'desc' | 'none') => {
      const newSort = sortDirection === 'none' ? {} : { sortBy, sortDirection }
      setCurrentSort(newSort)
      setPage(0)
      fetchIssues(currentTab, 0, rowsPerPage, newSort)
    },
    [fetchIssues, currentTab, rowsPerPage]
  )

  const serverSidePagination = {
    enabled: true,
    totalCount: tasks.totalCount ?? 0,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onSortChange: handleSortChange
  }

  return (
    <UserProfilePublicPage
      user={user}
      tasks={tasks}
      searchUser={searchUser}
      serverSidePagination={serverSidePagination}
      onTabChange={handleTabChange}
    />
  )
}

export default ProfilePage
