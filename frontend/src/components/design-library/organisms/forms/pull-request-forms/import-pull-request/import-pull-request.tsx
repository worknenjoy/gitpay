import React from 'react'
import { useIntl } from 'react-intl'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import type { ButtonProps as MUIButtonProps } from '@mui/material/Button'
import SplitButton from '../../../../atoms/buttons/split-button/split-button'
import PullRequestIcon from '../../../../atoms/icons/pull-request-icon/pull-request-icon'
import ImportPullRequestDialog, {
  ImportPullRequestMode,
  ImportPullRequestStep,
  ResolvedPullRequest
} from '../../../../molecules/dialogs/import-pull-request-dialog/import-pull-request-dialog'

const RESOLVE_DEBOUNCE_MS = 500

export type CreatedPaymentRequest = {
  id: string | number
  paymentUrl: string
}

export type ImportPullRequestSubmitData = {
  pullRequest: ResolvedPullRequest
  mode: ImportPullRequestMode
  price: string
}

export type ImportPullRequestPostData = {
  paymentRequestId: string | number
  comment: string
  /** Passed through so the caller can persist enough to resume if posting fails for a reason the user needs to act on (e.g. missing GitHub write access) — see resumePendingPost. */
  resolvedPullRequest: ResolvedPullRequest
  createdPaymentRequest: CreatedPaymentRequest
}

export type PendingPost = {
  resolvedPullRequest: ResolvedPullRequest
  createdPaymentRequest: CreatedPaymentRequest
  comment: string
}

export type ImportPullRequestProps = {
  onImportIssueClick: () => void
  onViewPaymentRequests?: () => void
  color?: MUIButtonProps['color']
  viewerUsername: string
  /** Resolves a pasted PR URL against the backend; returns undefined for an invalid/unauthored/unmerged/not-found PR (the backend already surfaces the specific error). */
  resolvePullRequest: (url: string) => Promise<ResolvedPullRequest | undefined>
  buildShareUrl: (paymentUrl: string) => string
  buildComment: (args: {
    pullRequest: ResolvedPullRequest
    mode: ImportPullRequestMode
    price: string
    shareUrl: string
  }) => string
  /** Creates the payment request. Called exactly once per dialog session, from the review step. */
  onSubmit: (data: ImportPullRequestSubmitData) => Promise<CreatedPaymentRequest>
  /** Posts the comment. If this rejects because the user needs to grant GitHub write access, the
   * caller is expected to redirect them to grant it (see resumePendingPost) rather than reject —
   * a reject here is treated as a real failure. */
  onPost: (data: ImportPullRequestPostData) => Promise<void>
  /** A payment request that was already created but couldn't be posted (missing GitHub write
   * access) before the user was redirected away to grant it — reopens the dialog at the done
   * step with everything intact so they can just retry posting. */
  resumePendingPost?: PendingPost
}

const ImportPullRequest = ({
  onImportIssueClick,
  onViewPaymentRequests,
  color = 'primary',
  viewerUsername,
  resolvePullRequest,
  buildShareUrl,
  buildComment,
  onSubmit,
  onPost,
  resumePendingPost
}: ImportPullRequestProps) => {
  const intl = useIntl()
  const [open, setOpen] = React.useState(false)
  const [pullRequestUrl, setPullRequestUrl] = React.useState('')
  const [resolvedPullRequest, setResolvedPullRequest] = React.useState<ResolvedPullRequest>()
  const [resolvingPullRequest, setResolvingPullRequest] = React.useState(false)
  const [mode, setMode] = React.useState<ImportPullRequestMode>('fixed')
  const [price, setPrice] = React.useState('0.00')
  const [comment, setComment] = React.useState('')
  const [createdPaymentRequest, setCreatedPaymentRequest] = React.useState<CreatedPaymentRequest>()
  const [posted, setPosted] = React.useState(false)
  const [resumedInitialStep, setResumedInitialStep] = React.useState<ImportPullRequestStep>()

  // Reopens right where the user left off after being redirected away to grant GitHub write
  // access (see the container's onPost) — the payment request already exists, so this resumes
  // at the done step instead of making them start over.
  React.useEffect(() => {
    if (!resumePendingPost) return
    setResolvedPullRequest(resumePendingPost.resolvedPullRequest)
    setCreatedPaymentRequest(resumePendingPost.createdPaymentRequest)
    setComment(resumePendingPost.comment)
    setPosted(false)
    setResumedInitialStep('done')
    setOpen(true)
  }, [resumePendingPost])

  // Debounce so we don't hit the backend on every keystroke.
  React.useEffect(() => {
    if (!pullRequestUrl) {
      setResolvedPullRequest(undefined)
      return
    }
    let cancelled = false
    setResolvingPullRequest(true)
    const timer = setTimeout(async () => {
      const result = await resolvePullRequest(pullRequestUrl)
      if (!cancelled) {
        setResolvedPullRequest(result)
        setResolvingPullRequest(false)
      }
    }, RESOLVE_DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [pullRequestUrl, resolvePullRequest])

  const shareUrl = createdPaymentRequest ? buildShareUrl(createdPaymentRequest.paymentUrl) : ''

  // The real payment link only exists once the payment request is created, but the review
  // step needs to show what will be posted before that happens — so preview with a
  // placeholder in the link's place instead of leaving the user to guess.
  const previewComment = resolvedPullRequest
    ? buildComment({
        pullRequest: resolvedPullRequest,
        mode,
        price,
        shareUrl: intl.formatMessage({
          id: 'design.importPullRequestDialog.previewPlaceholderLink',
          defaultMessage: 'your payment link'
        })
      })
    : ''

  const handleClose = () => {
    setOpen(false)
    setPullRequestUrl('')
    setResolvedPullRequest(undefined)
    setMode('fixed')
    setPrice('0.00')
    setComment('')
    setCreatedPaymentRequest(undefined)
    setPosted(false)
    setResumedInitialStep(undefined)
  }

  // Creation only ever happens from the review step's two actions, each exactly once per
  // session — going back to the form step from there never re-triggers it, unlike the old
  // eager-create-on-continue flow (which duplicated the payment request if you edited and
  // continued again).
  const create = async () => {
    if (!resolvedPullRequest) throw new Error('No resolved pull request')
    const created = await onSubmit({ pullRequest: resolvedPullRequest, mode, price })
    setCreatedPaymentRequest(created)
    const nextShareUrl = buildShareUrl(created.paymentUrl)
    const nextComment = buildComment({
      pullRequest: resolvedPullRequest,
      mode,
      price,
      shareUrl: nextShareUrl
    })
    setComment(nextComment)
    return { created, comment: nextComment }
  }

  const handleCreate = async () => {
    await create()
  }

  const handleCreateAndPost = async () => {
    const { created, comment: nextComment } = await create()
    if (!resolvedPullRequest) return
    await onPost({
      paymentRequestId: created.id,
      comment: nextComment,
      resolvedPullRequest,
      createdPaymentRequest: created
    })
    setPosted(true)
  }

  const handlePostNow = async () => {
    if (!createdPaymentRequest || !resolvedPullRequest) return
    await onPost({
      paymentRequestId: createdPaymentRequest.id,
      comment,
      resolvedPullRequest,
      createdPaymentRequest
    })
    setPosted(true)
  }

  return (
    <>
      <SplitButton
        label={intl.formatMessage({ id: 'task.actions.import', defaultMessage: 'Import' })}
        color={color}
        actions={[
          {
            key: 'issue',
            label: intl.formatMessage({
              id: 'home.hero.headline.button.secondary',
              defaultMessage: 'Import issue'
            }),
            description: intl.formatMessage({
              id: 'task.actions.import.issue.description',
              defaultMessage: 'Add a bounty to an issue'
            }),
            icon: <BugReportOutlinedIcon fontSize="small" />,
            onClick: onImportIssueClick
          },
          {
            key: 'pull-request',
            label: intl.formatMessage({
              id: 'task.actions.import.pullRequest',
              defaultMessage: 'Import pull request'
            }),
            description: intl.formatMessage({
              id: 'task.actions.import.pullRequest.description',
              defaultMessage: 'Get paid for a merged PR you authored'
            }),
            icon: <PullRequestIcon fontSize="small" />,
            onClick: () => setOpen(true)
          }
        ]}
      />
      <ImportPullRequestDialog
        open={open}
        initialStep={resumedInitialStep}
        onClose={handleClose}
        pullRequestUrl={pullRequestUrl}
        onPullRequestUrlChange={setPullRequestUrl}
        resolvedPullRequest={resolvedPullRequest}
        resolvingPullRequest={resolvingPullRequest}
        mode={mode}
        onModeChange={setMode}
        price={price}
        onPriceChange={setPrice}
        viewerUsername={viewerUsername}
        previewComment={previewComment}
        comment={comment}
        onCommentChange={setComment}
        shareUrl={shareUrl}
        posted={posted}
        onCreate={handleCreate}
        onCreateAndPost={handleCreateAndPost}
        onPostNow={handlePostNow}
        onViewPaymentRequests={onViewPaymentRequests}
      />
    </>
  )
}

export default ImportPullRequest
