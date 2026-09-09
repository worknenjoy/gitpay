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
