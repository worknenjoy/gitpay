const routes = [
  { path: '/', exact: true },
  { path: '/recruitment' },
  { path: '/tasks/createdbyme' },
  { path: '/tasks/interested' },
  { path: '/tasks/assignedtome' },
  { path: '/tasks/all' },
  { path: '/tasks/open' },
  { path: '/tasks/progress' },
  { path: '/tasks/finished' },
  { path: '/login', exact: true },
  // redirect (usually excluded from sitemap)
  { path: '/tasks/explore', redirectTo: '/tasks/open' },
]

export default routes
