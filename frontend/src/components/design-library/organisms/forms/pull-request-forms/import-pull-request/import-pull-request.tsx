import React from 'react'
import { useIntl } from 'react-intl'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import SplitButton from '../../../../atoms/buttons/split-button/split-button'
import PullRequestIcon from '../../../../atoms/icons/pull-request-icon/pull-request-icon'
import ImportPullRequestDialog, {
  ImportPullRequestMode,
  ResolvedPullRequest
} from '../../../../molecules/dialogs/import-pull-request-dialog/import-pull-request-dialog'
import {
  PullRequestPickerOwner,
  PullRequestPickerRow
} from '../../../../molecules/lists/pull-request-picker-list/pull-request-picker-list'

export type ImportPullRequestSubmitData = {
  pullRequest?: ResolvedPullRequest
  mode: ImportPullRequestMode
  price: string
}

export type ImportPullRequestPostData = ImportPullRequestSubmitData & { comment: string }

export type ImportPullRequestProps = {
  onImportIssueClick: () => void
  viewerUsername: string
  connected?: boolean
  onConnectGithub?: () => void
  pullRequests?: PullRequestPickerRow[]
  owners?: PullRequestPickerOwner[]
  resolvePullRequest: (url: string) => ResolvedPullRequest | undefined
  buildShareUrl: (pullRequest: ResolvedPullRequest) => string
  buildComment: (args: {
    pullRequest: ResolvedPullRequest
    mode: ImportPullRequestMode
    price: string
    shareUrl: string
  }) => string
  onSubmit?: (data: ImportPullRequestSubmitData) => void
  onPost?: (data: ImportPullRequestPostData) => Promise<void> | void
}

const ImportPullRequest = ({
  onImportIssueClick,
  viewerUsername,
  connected,
  onConnectGithub,
  pullRequests = [],
  owners = [],
  resolvePullRequest,
  buildShareUrl,
  buildComment,
  onSubmit,
  onPost
}: ImportPullRequestProps) => {
  const intl = useIntl()
  const [open, setOpen] = React.useState(false)
  const [pullRequestUrl, setPullRequestUrl] = React.useState('')
  const [pickedPullRequestNumber, setPickedPullRequestNumber] = React.useState<number>()
  const [mode, setMode] = React.useState<ImportPullRequestMode>('fixed')
  const [price, setPrice] = React.useState('0.00')
  const [comment, setComment] = React.useState('')

  const pickedPullRequest = pullRequests.find((pr) => pr.number === pickedPullRequestNumber)
  const resolvedPullRequest: ResolvedPullRequest | undefined =
    resolvePullRequest(pullRequestUrl) ??
    (pickedPullRequest
      ? {
          repo: pickedPullRequest.repo,
          number: pickedPullRequest.number,
          title: pickedPullRequest.title,
          state: pickedPullRequest.state
        }
      : undefined)

  const shareUrl = resolvedPullRequest ? buildShareUrl(resolvedPullRequest) : ''

  const handleSubmit = () => {
    if (resolvedPullRequest) {
      setComment(buildComment({ pullRequest: resolvedPullRequest, mode, price, shareUrl }))
    }
    onSubmit?.({ pullRequest: resolvedPullRequest, mode, price })
  }

  const handlePost = async () => {
    await onPost?.({ pullRequest: resolvedPullRequest, mode, price, comment })
  }

  return (
    <>
      <SplitButton
        label={intl.formatMessage({ id: 'task.actions.import', defaultMessage: 'Import' })}
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
              defaultMessage: 'Get paid for a PR you authored'
            }),
            icon: <PullRequestIcon fontSize="small" />,
            onClick: () => setOpen(true)
          }
        ]}
      />
      <ImportPullRequestDialog
        open={open}
        onClose={() => setOpen(false)}
        pullRequestUrl={pullRequestUrl}
        onPullRequestUrlChange={setPullRequestUrl}
        resolvedPullRequest={resolvedPullRequest}
        connected={connected}
        onConnectGithub={onConnectGithub}
        pullRequests={pullRequests}
        owners={owners}
        pickedPullRequestNumber={pickedPullRequestNumber}
        onPickedPullRequestChange={setPickedPullRequestNumber}
        mode={mode}
        onModeChange={setMode}
        price={price}
        onPriceChange={setPrice}
        viewerUsername={viewerUsername}
        comment={comment}
        onCommentChange={setComment}
        shareUrl={shareUrl}
        onSubmit={handleSubmit}
        onPost={handlePost}
      />
    </>
  )
}

export default ImportPullRequest
