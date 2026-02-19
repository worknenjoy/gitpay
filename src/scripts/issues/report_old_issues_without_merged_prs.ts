import { findOldIssuesWithoutMergedPrsReport } from '../../queries/issue/pull-request/findOldIssuesWithoutMergedPrsReport'

const reportOldIssuesWithoutMergedPrsScript = async () => {
  const results = await findOldIssuesWithoutMergedPrsReport({ olderThanDays: 365 })

  console.log('Old issues (> 1 year) with no merged PRs:', results.length)

  const providerTotals: Record<string, { count: number; paidCount: number; totalAmount: number; paidAmount: number }> = {}
  for (const entry of results as any[]) {
    const statsByProvider = entry?.orderStatsByProvider ?? {}
    for (const provider of Object.keys(statsByProvider)) {
      providerTotals[provider] = providerTotals[provider] ?? {
        count: 0,
        paidCount: 0,
        totalAmount: 0,
        paidAmount: 0
      }
      providerTotals[provider].count += statsByProvider[provider].count
      providerTotals[provider].paidCount += statsByProvider[provider].paidCount
      providerTotals[provider].totalAmount += statsByProvider[provider].totalAmount
      providerTotals[provider].paidAmount += statsByProvider[provider].paidAmount
    }
  }

  console.log('------------------- Orders Summary (by provider) -------------------')
  for (const provider of Object.keys(providerTotals)) {
    const t = providerTotals[provider]
    console.log(
      `${provider}: orders=${t.count}, paid=${t.paidCount}, totalAmount=${t.totalAmount}, paidAmount=${t.paidAmount}`
    )
  }

  for (const entry of results as any[]) {
    const issue = entry.issue
    console.log('------------------- Issue Details -------------------------')
    console.log(`Issue ID: ${issue.id}`)
    console.log(`Title: ${issue.title}`)
    console.log(`URL: ${issue.url}`)
    console.log(`CreatedAt: ${issue.createdAt} | AgeDays: ${entry.ageDays}`)
    console.log(`LastOrderAt: ${entry.lastOrderAt}`)

    console.log('------------------- Orders Details ------------------------')
    const byProvider = entry.ordersByProviderAndType ?? {}
    for (const provider of Object.keys(byProvider)) {
      console.log(`Provider: ${provider}`)
      const byType = byProvider[provider] ?? {}
      for (const type of Object.keys(byType)) {
        const orders = byType[type] ?? []
        console.log(`  Type: ${type} | count=${orders.length}`)
        for (const o of orders) {
          console.log(
            `    - Order#${o.id} status=${o.status} paid=${o.paid} amount=${o.amount} ${o.currency} createdAt=${o.createdAt}`
          )
        }
      }
    }

    const draftPrs = entry?.pullRequests?.draft ?? []
    if (draftPrs.length > 0) {
      console.log('------------------- Draft PRs -----------------------------')
      for (const pr of draftPrs) {
        console.log(`- ${pr.html_url ?? '(no url)'} | #${pr.number ?? ''} | ${pr.title ?? ''}`)
      }
    } else {
      const linked = entry?.pullRequests?.linked ?? []
      console.log('------------------- Linked PRs ----------------------------')
      console.log(`Linked PRs: ${linked.length} (no merged)`)
    }
  }
}

reportOldIssuesWithoutMergedPrsScript()
