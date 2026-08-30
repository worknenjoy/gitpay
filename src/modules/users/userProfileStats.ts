import models from '../../models'

const currentModels = models as any

// Public, per-user profile stats — whitelisted counts/sums only.
// Never return balances, payout status, or provider account ids here (see userInfo.ts,
// which is the auth-gated equivalent and is NOT safe to expose on a public endpoint).
export async function userProfileStats(userId: number | string) {
  const numericUserId = Number(userId)

  const user = await currentModels.User.findByPk(numericUserId, { attributes: ['id', 'createdAt'] })

  // --- Contributor: tasks with an accepted assignment for this user ---
  const acceptedAssigns = await currentModels.Assign.findAll({
    attributes: ['TaskId'],
    where: { userId: numericUserId, status: 'accepted' }
  })
  const solvedTaskIds = acceptedAssigns.map((a: any) => a.TaskId)
  const solvedTasks = solvedTaskIds.length
    ? await currentModels.Task.findAll({
        attributes: ['id', 'value', 'paid'],
        where: { id: solvedTaskIds, status: 'closed' }
      })
    : []
  const issuesSolvedCount = solvedTasks.length
  const totalEarned = solvedTasks
    .filter((t: any) => t.paid)
    .reduce((sum: number, t: any) => sum + Number(t.value || 0), 0)

  // --- Sponsored tasks (also feeds the Funding role) ---
  const sponsoredOrders = await currentModels.Order.findAll({
    attributes: ['TaskId', 'amount'],
    where: { userId: numericUserId, status: 'succeeded' }
  })
  const sponsoredTaskIds = [...new Set(sponsoredOrders.map((o: any) => o.TaskId))]
  const issuesSponsoredCount = sponsoredTaskIds.length
  const totalFunded = sponsoredOrders.reduce(
    (sum: number, o: any) => sum + Number(o.amount || 0),
    0
  )
  const sponsoredTasks = sponsoredTaskIds.length
    ? await currentModels.Task.findAll({
        attributes: ['id', 'ProjectId'],
        where: { id: sponsoredTaskIds }
      })
    : []
  const projectsSponsoredCount = new Set(
    sponsoredTasks.map((t: any) => t.ProjectId).filter(Boolean)
  ).size

  // --- Maintainer: organizations owned by this user, and their projects ---
  const organizations = await currentModels.Organization.findAll({
    where: { UserId: numericUserId },
    attributes: ['id', 'createdAt']
  })
  const organizationIds = organizations.map((o: any) => o.id)
  const projects = organizationIds.length
    ? await currentModels.Project.findAll({
        where: { OrganizationId: organizationIds },
        attributes: ['id']
      })
    : []
  const projectIds = projects.map((p: any) => p.id)
  const projectsMaintainedCount = projectIds.length

  let totalFundedForProjects = 0
  let openBountiesCount = 0
  let contributorsCount = 0
  if (projectIds.length > 0) {
    const maintainedTasks = await currentModels.Task.findAll({
      attributes: ['id', 'status', 'value'],
      where: { ProjectId: projectIds }
    })
    const maintainedTaskIds = maintainedTasks.map((t: any) => t.id)
    openBountiesCount = maintainedTasks.filter(
      (t: any) => t.status === 'open' && Number(t.value) > 0
    ).length

    if (maintainedTaskIds.length > 0) {
      const maintainedOrders = await currentModels.Order.findAll({
        attributes: ['amount'],
        where: { TaskId: maintainedTaskIds, status: 'succeeded' }
      })
      totalFundedForProjects = maintainedOrders.reduce(
        (sum: number, o: any) => sum + Number(o.amount || 0),
        0
      )

      const maintainedAssigns = await currentModels.Assign.findAll({
        attributes: ['userId'],
        where: { TaskId: maintainedTaskIds, status: 'accepted' }
      })
      contributorsCount = new Set(maintainedAssigns.map((a: any) => a.userId)).size
    }
  }
  const maintainingSince = organizations.length
    ? organizations.reduce(
        (min: Date, o: any) => (o.createdAt < min ? o.createdAt : min),
        organizations[0].createdAt
      )
    : null

  // --- Provider: payment links (PaymentRequest) created by this user ---
  const paymentRequests = await currentModels.PaymentRequest.findAll({
    where: { userId: numericUserId },
    attributes: ['id', 'active', 'createdAt']
  })
  const activeLinksCount = paymentRequests.filter((pr: any) => pr.active).length
  const paymentRequestIds = paymentRequests.map((pr: any) => pr.id)

  let jobsDeliveredCount = 0
  let totalReceived = 0
  let repeatClientsPct: number | null = null
  if (paymentRequestIds.length > 0) {
    const payments = await currentModels.PaymentRequestPayment.findAll({
      attributes: ['amount', 'customerId'],
      where: { paymentRequestId: paymentRequestIds, status: ['paid', 'succeeded'] }
    })
    jobsDeliveredCount = payments.length
    totalReceived = payments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)

    const paymentCountByCustomer = payments.reduce((acc: Record<number, number>, p: any) => {
      acc[p.customerId] = (acc[p.customerId] || 0) + 1
      return acc
    }, {})
    const distinctCustomers = Object.keys(paymentCountByCustomer).length
    if (distinctCustomers > 0) {
      const repeatCustomers = Object.values(paymentCountByCustomer).filter((c: any) => c > 1).length
      repeatClientsPct = Math.round((repeatCustomers / distinctCustomers) * 100)
    }
  }
  const providerSince = paymentRequests.length
    ? paymentRequests.reduce(
        (min: Date, pr: any) => (pr.createdAt < min ? pr.createdAt : min),
        paymentRequests[0].createdAt
      )
    : null

  return {
    contributor: {
      issuesSolvedCount,
      issuesSponsoredCount,
      totalEarned,
      joinedAt: user?.createdAt ?? null
    },
    maintainer: {
      projectsMaintainedCount,
      totalFundedForProjects,
      openBountiesCount,
      contributorsCount,
      maintainingSince
    },
    provider: {
      jobsDeliveredCount,
      totalReceived,
      activeLinksCount,
      repeatClientsPct,
      providerSince
    },
    funding: {
      projectsSponsoredCount,
      totalFunded,
      bountiesPlacedCount: issuesSponsoredCount
    }
  }
}
