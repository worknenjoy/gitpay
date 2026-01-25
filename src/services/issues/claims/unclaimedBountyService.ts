import { type Issue } from '../../../types/issue'
import { findUnclaimedBounties } from '../../../queries/issue/bounty/findUnclaimedBounties'
import { findIssueLinkedPullRequest } from '../../../queries/issue/pull-request/findIssueLinkedPullRequest'
import { findUserByProvider } from '../../../queries/user/findUserByProvider'

export const notifyUnclamedBounties = async () => {
  const unclaimedBounties = await findUnclaimedBounties()
  unclaimedBounties.forEach(async (issue: Issue) => {
    const issueId = issue.id
    try {
      const issueWithLinkedPR = await findIssueLinkedPullRequest(issueId)
      if (issueWithLinkedPR && issueWithLinkedPR.length > 0) {
        console.log('------------------- Issue Details -------------------------')
        console.log(`Processing Issue ID: ${issue.id} with unclaimed bounty.`)
        console.log(`Issue Title: ${issue.title}`)
        console.log(`Issue URL: ${issue.url}`)
        issueWithLinkedPR.forEach(async (pr: any) => {
          console.log(`- PR #${pr.number}: ${pr.html_url}`)
          const author = pr.user.login
          const provider_id = pr.user.id
          const provider_username = pr.user.login
          const author_email = pr.user.email
          console.log(`- Author: ${author}`)
          console.log(`- Author Provider ID: ${provider_id}`)
          console.log(`- Author Provider Username: ${provider_username}`)
          console.log(`- Author Email: ${author_email}`)

          const userOnGitpay = await findUserByProvider({
            provider: 'github',
            provider_id: provider_id.toString(),
            provider_username: provider_username
          })
          console.log(`- GitPay users found linked to this author: ${userOnGitpay.length}`)
          userOnGitpay.forEach((user:any) => {
            console.log(`- Searching for GitPay user linked to this author...`)
            if (user) {
              console.log(`------------`)
              console.log(`- GitPay User Found:`)
              console.log(`- GitPay User ID: ${user.id}`)
              console.log(`- GitPay User Email: ${user.email}`)
              console.log(`- GitPay User Username: ${user.username}`)
              console.log(`- Notify user about unclaimed bounty!`)
              console.log(`------------`)
          } else {
            console.log(`- No GitPay user found for this author.`)
          }
          })
          console.log('-----------------------------------------------------------')
        })
      } else {
        console.log(`Issue ID ${issueId} does not have a linked pull request.`)
      }
    } catch (error: any) {
      console.error(
        `Error processing issue ID ${issueId}`,
        error?.error?.status || 'unknown status',
        error?.error?.message || 'Unknown error'
      )
    }
  })
}
