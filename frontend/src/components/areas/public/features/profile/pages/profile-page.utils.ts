import moment from 'moment'

export const isContributorType = (types: { name: string }[] = []) =>
  types.some((type) => type.name === 'contributor')

/**
 * Shapes the raw `User` row (as returned by `GET /users`) into the
 * `ContributorProfileData` the Contributor variant expects — splitting the
 * skills CSV into an array, turning `openForJobs` into an availability chip,
 * composing the identity lines from `createdAt` + the solved-tasks count,
 * and picking the 'contributor' Type as the header's role badge. Fields with
 * no real data (e.g. no `createdAt`) are simply omitted.
 */
export const mapToContributorProfileData = (
  userData: any,
  solvedCount: number,
  pullRequestCount: number,
  paymentLinks: any[] = []
) => {
  if (!userData) return userData

  const identity = [
    userData.createdAt ? `Joined ${moment(userData.createdAt).format('MMM YYYY')}` : null,
    `${solvedCount} issues solved`
  ].filter(Boolean) as string[]

  const availability = userData.openForJobs
    ? [{ label: 'Open for job opportunities', active: true }]
    : []

  const skills = userData.skills
    ? userData.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter(Boolean)
    : []

  const contributorType = (userData.Types ?? []).find((type: any) => type.name === 'contributor')

  return {
    ...userData,
    identity,
    availability,
    skills,
    role: contributorType ? { name: contributorType.name, tone: 'orange' } : undefined,
    paymentLinks,
    bountyTabs: [
      { value: 'solved', label: 'Issues solved', count: solvedCount },
      { value: 'pull-requests', label: 'Pull requests', count: pullRequestCount }
    ]
  }
}

export const isProviderType = (types: { name: string }[] = []) =>
  types.some((type) => type.name === 'provider')

/**
 * Shapes the raw `User` row into the `ServiceProviderProfileData` the
 * Service Provider variant expects — identity lines from `createdAt` plus
 * the total payments across the user's publicly listed payment links
 * (summed client-side from each link's `paidCount`, since there's no
 * backend aggregate for it), and picking the 'provider' Type as the
 * header's role badge.
 */
export const mapToServiceProviderProfileData = (userData: any, paymentLinks: any[] = []) => {
  if (!userData) return userData

  const totalPayments = paymentLinks.reduce(
    (sum: number, link: any) => sum + (link.paidCount ?? 0),
    0
  )

  const identity = [
    userData.createdAt ? `Provider since ${moment(userData.createdAt).format('YYYY')}` : null,
    `${totalPayments} payment${totalPayments === 1 ? '' : 's'}`
  ].filter(Boolean) as string[]

  const isProvider = (userData.Types ?? []).some((type: any) => type.name === 'provider')

  return {
    ...userData,
    identity,
    // The backend Type is named 'provider', but the design's role pill reads
    // "service provider" — display copy diverges from the stored Type name.
    role: isProvider ? { name: 'service provider', tone: 'yellow' } : undefined,
    paymentLinks
  }
}

export const isMaintainerType = (types: { name: string }[] = []) =>
  types.some((type) => type.name === 'maintainer')

// Same "paid" definition `ProjectCard` itself uses (a valued, non-open task)
// — kept in sync so the header stat and the per-project cards always agree.
const projectPaidOut = (tasks: any[] = []) =>
  tasks
    .filter((task) => task.value && task.status !== 'open')
    .reduce((sum, task) => sum + Number(task.value), 0)

/**
 * Shapes the raw `User` row into the `MaintainerProfileData` the Maintainer
 * variant expects — identity lines from `createdAt` + the project count, and
 * a stats line with the total paid out across those projects. `projects`
 * come from `GET /projects/list?userId=` (each with its `Tasks` already
 * included), so nothing here is fabricated. No `availability` chips or
 * contributor count are set — neither has real backing data today.
 */
export const mapToMaintainerProfileData = (userData: any, projects: any[] = []) => {
  if (!userData) return userData

  const totalPaidOut = projects.reduce(
    (sum: number, project: any) => sum + projectPaidOut(project.Tasks),
    0
  )

  const identity = [
    userData.createdAt ? `Maintaining since ${moment(userData.createdAt).format('YYYY')}` : null,
    `${projects.length} active project${projects.length === 1 ? '' : 's'}`
  ].filter(Boolean) as string[]

  const isMaintainer = (userData.Types ?? []).some((type: any) => type.name === 'maintainer')

  return {
    ...userData,
    identity,
    role: isMaintainer ? { name: 'maintainer', tone: 'teal' } : undefined
  }
}
