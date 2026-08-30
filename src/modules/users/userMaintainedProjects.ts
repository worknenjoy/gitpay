import { findUserByIdWithOrganizations } from '../../queries/user/findUserByIdWithOrganizations'

// Public, per-user "projects maintained" list — whitelisted display fields plus per-project
// rollups (open bounties / paid out / issue count) computed from the included tasks.
// Never returns organization/user internals beyond name+id.
export async function userMaintainedProjects(userId: number | string) {
  const user = await findUserByIdWithOrganizations(Number(userId))
  if (!user) return []

  const organizations = user.Organizations || []

  return organizations.flatMap((org: any) =>
    (org.Projects || []).map((project: any) => {
      const tasks = project.Tasks || []
      const openBountyCount = tasks.filter(
        (t: any) => t.status === 'open' && Number(t.value) > 0
      ).length
      const totalPaid = tasks
        .filter((t: any) => t.paid)
        .reduce((sum: number, t: any) => sum + Number(t.value || 0), 0)

      return {
        id: project.id,
        name: project.name,
        repo: project.repo,
        description: project.description,
        org: org.name,
        organizationId: org.id,
        openBountyCount,
        totalPaid,
        issuesCount: tasks.length
      }
    })
  )
}
