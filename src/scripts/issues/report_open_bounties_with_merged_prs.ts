import { i18nConfigure } from '../../shared/i18n/i18n'
import { findOpenBountiesWithMergedPRs } from '../../queries/issue/bounty/findOpenBountiesWithMergedPRs'

const reportOpenBountiesWithMergedPRsScript = async () => {
  i18nConfigure()
  const openBountiesWithMergedPrs = await findOpenBountiesWithMergedPRs()
  console.log('Open Bounties (> 1 year) with Merged PRs:', openBountiesWithMergedPrs.length)
  console.log(
    'Total amount:',
    openBountiesWithMergedPrs.reduce((sum, { issue }) => sum + (Number(issue.value) || 0), 0)
  )
  for (const { issue, providerIssues, user } of openBountiesWithMergedPrs) {
    console.log('------------------- Issue Details -------------------------')
    console.log(`Processing Issue ID: ${issue.id} (open for > 1 year)`)
    console.log(`Issue Title: ${issue.title}`)
    console.log(`Issue URL: ${issue.url}`)
    console.log(`Issue Bounty Value: ${issue.value}`)
    console.log(`Issue Created At: ${issue.createdAt}`)
    console.log('------------------- Merged PRs Details --------------------')
    for (const pr of providerIssues) {
      console.log(`- Merged PR URL: ${pr.html_url}`)
      console.log(`- Merged PR Author: ${pr.user.login}`)
      console.log(`- Merged At: ${pr.pull_request.merged_at}`)
    }
    if (user) {
      console.log('------------------- GitPay User Details -------------------')
      console.log(`- GitPay User ID: ${user.id}`)
      console.log(`- GitPay User Email: ${user.email}`)
      console.log(`- GitPay User Username: ${user.username}`)
    } else {
      console.log('- No GitPay user found for this author.')
    }
    console.log('-----------------------------------------------------------')
  }
}

reportOpenBountiesWithMergedPRsScript()
