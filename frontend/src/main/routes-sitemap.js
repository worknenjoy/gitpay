const routes = [
  // Canonical public landing pages.
  { path: '/', exact: true },
  { path: '/welcome', exact: true },
  { path: '/use-cases/open-source', exact: true },
  { path: '/use-cases/private-projects', exact: true },
  { path: '/use-cases/service-payments', exact: true },
  { path: '/use-cases/fund-work', exact: true },
  { path: '/use-cases/bounties', exact: true },
  { path: '/team', exact: true },
  { path: '/pricing', exact: true },

  // Canonical public explore pages. Skip /explore because it redirects to /explore/issues.
  { path: '/explore/issues', exact: true },
  { path: '/explore/projects', exact: true },
  { path: '/explore/organizations', exact: true }
]

export default routes
