import UserProfilePublicPage from 'design-library/pages/public-pages/user-profile-public-page/user-profile-public-page'
import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { isContributorType, mapToContributorProfileData } from './profile-page.utils'

const TAB_TO_PARAM: Record<string, string> = {
  created: 'userId',
  supported: 'supportedByUserId'
}

const DEFAULT_ROWS_PER_PAGE = 10

const ProfilePage = ({
  user,
  searchUser,
  tasks,
  listTasks,
  pullRequests,
  listPublicTaskSolutions,
  paymentLinks,
  listPublicPaymentRequests
}) => {
  // The public profile link is "friendly" — /#/users/:id-:username/ (see
  // account-menu.tsx, which generates it) — so the id needs pulling out of
  // the leading numeric segment before the hyphen, same as a task's
  // /task/:id/:slug route.
  const { userId: userIdParam } = useParams<{ userId: string }>()
  const userId = userIdParam?.split('-')[0]
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [currentSort, setCurrentSort] = React.useState<{ sortBy?: string; sortDirection?: string }>(
    {}
  )
  const [currentTab, setCurrentTab] = React.useState('created')

  const isContributor = isContributorType(user?.data?.Types)

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

  const fetchSolvedIssues = useCallback(
    (pageOverride?: number, rowsOverride?: number, sortOverride?: typeof currentSort) => {
      const activePage = pageOverride ?? page
      const activeRows = rowsOverride ?? rowsPerPage
      const activeSort = sortOverride ?? currentSort
      listTasks({
        assignedTo: userId,
        status: 'closed',
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, page, rowsPerPage, currentSort, listTasks]
  )

  useEffect(() => {
    if (userId) {
      searchUser({ id: userId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Once the profile has loaded and we know whether this user is a
  // contributor, fetch the data each variant actually needs.
  useEffect(() => {
    if (!userId || !user?.completed || !user?.data?.id) return
    if (isContributor) {
      fetchSolvedIssues(0, rowsPerPage, {})
      listPublicTaskSolutions(userId)
      listPublicPaymentRequests(userId)
    } else {
      fetchIssues('created', 0, rowsPerPage, {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, user?.completed, user?.data?.id, isContributor])

  const handleTabChange = useCallback(
    (newTab: string) => {
      setCurrentTab(newTab)
      setPage(0)
      setCurrentSort({})
      fetchIssues(newTab, 0, rowsPerPage, {})
    },
    [fetchIssues, rowsPerPage]
  )

  const handleBountyTabChange = useCallback(
    (newBountyTab: string) => {
      setPage(0)
      setCurrentSort({})
      if (newBountyTab === 'solved') {
        fetchSolvedIssues(0, rowsPerPage, {})
      }
      // 'pull-requests' data isn't paginated — it's already loaded.
    },
    [fetchSolvedIssues, rowsPerPage]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      if (isContributor) {
        fetchSolvedIssues(newPage, rowsPerPage, currentSort)
      } else {
        fetchIssues(currentTab, newPage, rowsPerPage, currentSort)
      }
    },
    [isContributor, fetchSolvedIssues, fetchIssues, currentTab, rowsPerPage, currentSort]
  )

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      if (isContributor) {
        fetchSolvedIssues(0, newRowsPerPage, currentSort)
      } else {
        fetchIssues(currentTab, 0, newRowsPerPage, currentSort)
      }
    },
    [isContributor, fetchSolvedIssues, fetchIssues, currentTab, currentSort]
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: 'asc' | 'desc' | 'none') => {
      const newSort = sortDirection === 'none' ? {} : { sortBy, sortDirection }
      setCurrentSort(newSort)
      setPage(0)
      if (isContributor) {
        fetchSolvedIssues(0, rowsPerPage, newSort)
      } else {
        fetchIssues(currentTab, 0, rowsPerPage, newSort)
      }
    },
    [isContributor, fetchSolvedIssues, fetchIssues, currentTab, rowsPerPage]
  )

  // Canonical, shareable profile link — matches the friendly format
  // account-menu.tsx already generates (/#/users/:id-:username/).
  const shareUrl =
    typeof window !== 'undefined' && user?.data?.id
      ? `${window.location.origin}/#/users/${user.data.id}${
          user.data.username ? `-${user.data.username}` : ''
        }/`
      : undefined

  const serverSidePagination = {
    enabled: true,
    totalCount: tasks.totalCount ?? 0,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onSortChange: handleSortChange
  }

  const contributorUser = isContributor
    ? {
        ...user,
        data: mapToContributorProfileData(
          user.data,
          tasks.totalCount ?? 0,
          pullRequests?.data?.length ?? 0,
          paymentLinks?.data ?? []
        )
      }
    : user

  return (
    <UserProfilePublicPage
      user={contributorUser}
      tasks={tasks}
      pullRequests={pullRequests}
      profileTypes={isContributor ? ['contributor'] : []}
      searchUser={searchUser}
      serverSidePagination={serverSidePagination}
      onTabChange={handleTabChange}
      onBountyTabChange={handleBountyTabChange}
      onPayLink={(link: { url: string }) => window.open(link.url, '_blank', 'noreferrer')}
      shareUrl={shareUrl}
    />
  )
}

export default ProfilePage
