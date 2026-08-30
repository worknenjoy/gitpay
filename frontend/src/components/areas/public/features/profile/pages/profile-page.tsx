import UserProfilePublicPage from 'design-library/pages/public-pages/user-profile-public-page/user-profile-public-page'
import ContributorProfilePage from 'design-library/pages/public-pages/contributor-profile-page/contributor-profile-page'
import MaintainerProfilePage from 'design-library/pages/public-pages/maintainer-profile-page/maintainer-profile-page'
import ProviderProfilePage from 'design-library/pages/public-pages/provider-profile-page/provider-profile-page'
import CombinedProfilePage, {
  CombinedRole
} from 'design-library/pages/public-pages/combined-profile-page/combined-profile-page'
import React, { useEffect, useCallback, useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Legacy (0-role, or funding-only — there's no standalone Funding page design) tabs.
const LEGACY_TAB_TO_PARAM: Record<string, string> = {
  created: 'userId',
  supported: 'supportedByUserId'
}

// Role-based variants' single task list, keyed by the tab that needs it.
const ROLE_TASK_FETCH: Record<string, { param: string; extra?: Record<string, any> }> = {
  solved: { param: 'solvedByUserId' },
  sponsored: { param: 'supportedByUserId' },
  maintainer: { param: 'maintainedByUserId', extra: { hasBounty: true, status: 'open' } },
  funding: { param: 'supportedByUserId' }
}

const DEFAULT_ROWS_PER_PAGE = 10

type ProfilePageProps = {
  user: any
  searchUser: (params: any) => void
  tasks: any
  listTasks: (params: any) => void
  profileStats: any
  getUserProfileStats: (userId: any) => void
  paymentLinks: any
  getPublicPaymentLinksByUser: (userId: any) => void
  maintainedProjects: any
  getMaintainedProjects: (userId: any) => void
}

const ProfilePage = ({
  user,
  searchUser,
  tasks,
  listTasks,
  profileStats,
  getUserProfileStats,
  paymentLinks,
  getPublicPaymentLinksByUser,
  maintainedProjects,
  getMaintainedProjects
}: ProfilePageProps) => {
  const { userId, role } = useParams<{ userId: string; role?: string }>()
  const history = useHistory()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [currentSort, setCurrentSort] = React.useState<{ sortBy?: string; sortDirection?: string }>(
    {}
  )
  const [legacyTab, setLegacyTab] = React.useState('created')
  const [contributorTab, setContributorTab] = React.useState<'solved' | 'sponsored'>('solved')

  const types: string[] = (user?.data?.Types || []).map((t: any) => t.name)
  const variant = useMemo(() => {
    if (types.length >= 2) return 'combined'
    if (types.length === 1 && types[0] !== 'funding') return types[0]
    return 'legacy'
  }, [types])

  const activeRole: CombinedRole = (variant === 'combined' ? (role as CombinedRole) : undefined) || 'overview'

  // The single active tab key driving the task list, across all variants.
  const activeTaskTab =
    variant === 'contributor'
      ? contributorTab
      : variant === 'maintainer'
        ? 'maintainer'
        : variant === 'combined'
          ? activeRole
          : undefined

  const fetchIssues = useCallback(
    (
      tabKey?: string,
      pageOverride?: number,
      rowsOverride?: number,
      sortOverride?: typeof currentSort
    ) => {
      if (!tabKey) return
      const activePage = pageOverride ?? page
      const activeRows = rowsOverride ?? rowsPerPage
      const activeSort = sortOverride ?? currentSort
      const config = ROLE_TASK_FETCH[tabKey]
      if (config) {
        listTasks({
          [config.param]: userId,
          ...(config.extra || {}),
          page: activePage,
          limit: activeRows,
          ...(activeSort.sortBy ? activeSort : {})
        })
        return
      }
      // Legacy fallback: 'created' | 'supported'
      const paramKey = LEGACY_TAB_TO_PARAM[tabKey] ?? 'userId'
      listTasks({
        [paramKey]: userId,
        page: activePage,
        limit: activeRows,
        ...(activeSort.sortBy ? activeSort : {})
      })
    },
    [userId, page, rowsPerPage, currentSort, listTasks]
  )

  useEffect(() => {
    if (!userId) return
    searchUser({ id: userId })
    getUserProfileStats(userId)
    getPublicPaymentLinksByUser(userId)
    getMaintainedProjects(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (!userId) return
    setPage(0)
    setCurrentSort({})
    if (variant === 'legacy') {
      fetchIssues(legacyTab, 0, rowsPerPage, {})
    } else if (activeTaskTab && activeTaskTab !== 'overview' && activeTaskTab !== 'provider') {
      fetchIssues(activeTaskTab, 0, rowsPerPage, {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, variant, activeTaskTab])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchIssues(variant === 'legacy' ? legacyTab : activeTaskTab, newPage, rowsPerPage, currentSort)
    },
    [fetchIssues, variant, legacyTab, activeTaskTab, rowsPerPage, currentSort]
  )

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      fetchIssues(variant === 'legacy' ? legacyTab : activeTaskTab, 0, newRowsPerPage, currentSort)
    },
    [fetchIssues, variant, legacyTab, activeTaskTab, currentSort]
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: 'asc' | 'desc' | 'none') => {
      const newSort = sortDirection === 'none' ? {} : { sortBy, sortDirection }
      setCurrentSort(newSort)
      setPage(0)
      fetchIssues(variant === 'legacy' ? legacyTab : activeTaskTab, 0, rowsPerPage, newSort)
    },
    [fetchIssues, variant, legacyTab, activeTaskTab, rowsPerPage]
  )

  const handleLegacyTabChange = useCallback(
    (newTab: string) => {
      setLegacyTab(newTab)
      setPage(0)
      setCurrentSort({})
      fetchIssues(newTab, 0, rowsPerPage, {})
    },
    [fetchIssues, rowsPerPage]
  )

  const handleContributorTabChange = useCallback((newTab: 'solved' | 'sponsored') => {
    setContributorTab(newTab)
  }, [])

  const handleRoleChange = useCallback(
    (newRole: CombinedRole) => {
      history.replace(`/users/${userId}/${newRole}`)
    },
    [history, userId]
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

  if (variant === 'contributor') {
    return (
      <ContributorProfilePage
        profile={user.data}
        stats={profileStats?.data?.contributor}
        paymentLinks={paymentLinks?.data || []}
        issues={tasks}
        serverSidePagination={serverSidePagination}
        onTabChange={handleContributorTabChange}
      />
    )
  }

  if (variant === 'maintainer') {
    return (
      <MaintainerProfilePage
        profile={user.data}
        stats={profileStats?.data?.maintainer}
        statsCompleted={profileStats?.completed}
        projects={maintainedProjects?.data || []}
        bounties={tasks}
        serverSidePagination={serverSidePagination}
      />
    )
  }

  if (variant === 'provider') {
    return (
      <ProviderProfilePage
        profile={user.data}
        stats={profileStats?.data?.provider}
        statsCompleted={profileStats?.completed}
        paymentLinks={paymentLinks?.data || []}
      />
    )
  }

  if (variant === 'combined') {
    return (
      <CombinedProfilePage
        profile={user.data}
        stats={profileStats?.data}
        statsCompleted={profileStats?.completed}
        projects={maintainedProjects?.data || []}
        paymentLinks={paymentLinks?.data || []}
        issues={tasks}
        serverSidePagination={serverSidePagination}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
      />
    )
  }

  return (
    <UserProfilePublicPage
      user={user}
      tasks={tasks}
      searchUser={searchUser}
      serverSidePagination={serverSidePagination}
      onTabChange={handleLegacyTabChange}
    />
  )
}

export default ProfilePage
