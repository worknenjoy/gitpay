import { findUnclaimedBountiesWithMergedPrs } from '../../queries/issue/bounty/findUnclaimedBountiesWithMergedPrs'

const reportUnclamedBountiesScript = async () => {
  const unclaimedBountiesWithMergedPrs = await findUnclaimedBountiesWithMergedPrs()
  console.log('Unclaimed Bounties with Merged PRs:', unclaimedBountiesWithMergedPrs.length)
  console.log('Total amount of unclaimed bounties with merged PRs:', unclaimedBountiesWithMergedPrs.reduce((sum, { issue }) => sum + (Number(issue.value) || 0), 0))
  for (const { issue, providerIssues, user } of unclaimedBountiesWithMergedPrs) {
    console.log('------------------- Issue Details -------------------------')
    console.log(`Processing Issue ID: ${issue.id} with unclaimed bounty.`)
    console.log(`Issue Title: ${issue.title}`)
    console.log(`Issue URL: ${issue.url}`)
    console.log(`Issue Bounty Value: ${issue.value}`)
    console.log('------------------- Merged PRs Details --------------------')
    for (const pr of providerIssues) {
      console.log(`- Merged PR URL: ${pr.html_url}`)
      console.log(`- Merged PR Author: ${pr.user.login}`)
    }
    if (user) {
      console.log('------------------- GitPay User Details -------------------')
      console.log(`- GitPay User ID: ${user.id}`)
      console.log(`- GitPay User Email: ${user.email}`)
      console.log(`- GitPay User Username: ${user.username}`)
      console.log(`- Notify user about unclaimed bounty!`)
    } else {
      console.log('- No GitPay user found for this author.')
    }
    console.log('-----------------------------------------------------------')
  }
}

reportUnclamedBountiesScript()
