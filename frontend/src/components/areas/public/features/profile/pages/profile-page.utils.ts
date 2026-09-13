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
