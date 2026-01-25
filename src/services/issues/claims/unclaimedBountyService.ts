import { type Issue } from '../../../types/issue'
import { findUnclaimedBounties } from '../../../queries/issue/bounty/findUnclaimedBounties'
import { findIssueLinkedPullRequest } from '../../../queries/issue/pull-request/findIssueLinkedPullRequest'
import { findUsersByProvider } from '../../../queries/user/findUsersByProvider'

export const notifyUnclamedBounties = async () => {
  const unclaimedBounties = await findUnclaimedBounties()
  unclaimedBounties.forEach(async (issue: Issue) => {
    const issueId = issue.id
    try {
      const issueWithLinkedPR = await findIssueLinkedPullRequest(issueId)
      const issueWithLinkedMergedPR = issueWithLinkedPR
        ? issueWithLinkedPR.filter((issue: any) => issue.pull_request.merged_at !== null)
        : null
      if (issueWithLinkedMergedPR && issueWithLinkedMergedPR.length > 0) {
        console.log('------------------- Issue Details -------------------------')
        console.log(`Processing Issue ID: ${issue.id} with unclaimed bounty.`)
        console.log(`Issue Title: ${issue.title}`)
        console.log(`Issue URL: ${issue.url}`)
        issueWithLinkedMergedPR.forEach(async (pr: any) => {
          console.log(`- PR #${pr.number}: ${pr.html_url}`)
          const author = pr.user.login
          const provider_id = pr.user.id
          const provider_username = pr.user.login
          const author_email = pr.user.email

          const usersOnGitpay = await findUsersByProvider({
            provider: 'github',
            provider_id: provider_id.toString(),
            provider_username: provider_username
          })
          const amountOfUsers = usersOnGitpay ? usersOnGitpay.length : 0
          console.log(`- Author: ${author}`)
          console.log(`- Author Provider ID: ${provider_id}`)
          console.log(`- Author Provider Username: ${provider_username}`)
          console.log(`- Author Email: ${author_email}`)
          console.log(`- GitPay users found linked to this author: ${amountOfUsers}`)
          if (amountOfUsers > 0) {
            usersOnGitpay.forEach((user: any) => {
              console.log(`- Details of the GitPay users linked to this author...`)
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
          }
          console.log('-----------------------------------------------------------')
        })
      } else {
        console.log(`Issue ID ${issueId} does not have a linked merged pull request.`)
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
