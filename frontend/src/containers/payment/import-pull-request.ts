import { connect } from 'react-redux'
import { createIntl, createIntlCache } from 'react-intl'
import ImportPullRequest from '../../components/design-library/organisms/forms/pull-request-forms/import-pull-request/import-pull-request'
import { authorizeGithub } from '../../actions/loginActions'
import { createPaymentRequest } from '../../actions/paymentRequestActions'
import { resolvePullRequest, postPullRequestComment } from '../../actions/pullRequestActions'
import pullRequestMessages from '../../messages/pull-request-messages'

const PENDING_POST_KEY = 'gitpay:pendingPullRequestPost'

// paymentUrl already carries the right protocol from the backend (getFrontendHostBase
// resolves http for localhost, https otherwise) — pass it through as-is. Stripping and
// re-adding a hardcoded "https://" here previously broke localhost (served https for an
// http dev server) and broke ShareBar's copy/share links (which need a full absolute URL).
const buildShareUrl = (paymentUrl: string) => paymentUrl || ''

// This text is posted as a real GitHub comment, not rendered on screen, so it can't use
// <FormattedMessage> — createIntl gives the same message catalog + formatting standalone.
const intlCache = createIntlCache()

const buildCommentWithIntl = (
  { mode, price, shareUrl }: { mode: 'fixed' | 'custom'; price: string; shareUrl: string },
  intlState: { locale: string; messages: Record<string, string> }
) => {
  const intl = createIntl(intlState, intlCache)
  const intro = intl.formatMessage(
    mode === 'fixed'
      ? pullRequestMessages.commentIntroFixed
      : pullRequestMessages.commentIntroCustom,
    { price }
  )
  const payHere = intl.formatMessage(pullRequestMessages.commentPayHere, { url: shareUrl })
  const footer = intl.formatMessage(pullRequestMessages.commentFooter)

  return `${intro}\n\n${payHere}\n\n${footer}`
}

const buildDescription = (pullRequest: { repo: string; number: number; url?: string }) => {
  const url = pullRequest.url || `https://github.com/${pullRequest.repo}/pull/${pullRequest.number}`
  return `Payment for work delivered in pull request #${pullRequest.number} (${pullRequest.repo}).\n\n${url}`
}

// Reads and clears any payment request that was created but couldn't be posted because the
// user needed to grant GitHub write access — set right before redirecting them to grant it
// (see onPost below), consumed here so the dialog can reopen exactly where they left off.
const consumePendingPost = () => {
  try {
    const raw = window.localStorage.getItem(PENDING_POST_KEY)
    if (!raw) return undefined
    window.localStorage.removeItem(PENDING_POST_KEY)
    return JSON.parse(raw)
  } catch (e) {
    return undefined
  }
}

const mapStateToProps = (state: any) => {
  const user = state.loggedIn?.data || {}
  return {
    viewerUsername: user.provider_username,
    resumePendingPost: consumePendingPost(),
    buildComment: (args: { mode: 'fixed' | 'custom'; price: string; shareUrl: string }) =>
      buildCommentWithIntl(args, state.intl)
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    resolvePullRequest: async (url: string) => {
      const action: any = await dispatch(resolvePullRequest(url))
      return action.type === 'RESOLVE_PULL_REQUEST_SUCCESS' ? action.pullRequest : undefined
    },
    buildShareUrl,
    onSubmit: async ({ pullRequest, mode, price }: any) => {
      const action: any = await dispatch(
        createPaymentRequest({
          title: pullRequest.title,
          description: buildDescription(pullRequest),
          amount: mode === 'fixed' ? Number(price) : undefined,
          currency: 'USD',
          custom_amount: mode === 'custom',
          type: 'pull_request',
          url:
            pullRequest.url || `https://github.com/${pullRequest.repo}/pull/${pullRequest.number}`
        })
      )
      if (!action.paymentRequest?.id) {
        throw new Error('Failed to create the payment request')
      }
      return { id: action.paymentRequest.id, paymentUrl: action.paymentRequest.payment_url }
    },
    onPost: async ({
      paymentRequestId,
      comment,
      resolvedPullRequest,
      createdPaymentRequest
    }: any) => {
      const action: any = await dispatch(postPullRequestComment(paymentRequestId, comment))
      if (action.type === 'POST_PULL_REQUEST_COMMENT_SUCCESS') {
        return
      }

      const errorCode = action?.error?.response?.data?.error
      if (errorCode === 'GITHUB_WRITE_ACCESS_REQUIRED') {
        // The payment request already exists — don't lose that. Persist it, send the user to
        // grant GitHub write access, and resume right where they left off once they're back.
        try {
          window.localStorage.setItem(
            PENDING_POST_KEY,
            JSON.stringify({ resolvedPullRequest, createdPaymentRequest, comment })
          )
        } catch (e) {
          // localStorage unavailable — the redirect still works, just won't resume the dialog
        }
        dispatch(authorizeGithub())
        return
      }

      throw new Error('Failed to post the comment')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportPullRequest)
