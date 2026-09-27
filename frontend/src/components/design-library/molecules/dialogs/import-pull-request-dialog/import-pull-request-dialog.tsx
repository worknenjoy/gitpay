import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  AlertTitle,
  Typography
} from '@mui/material'
import githubLogo from 'images/github-logo-black.png'
import DialogTitle from '../dialog-title/dialog-title'
import Button from '../../../atoms/buttons/button/button'
import { CustomAlert } from '../../../atoms/alerts/alert/alert'
import SimpleInfo from '../../../atoms/alerts/simple-info/simple-info'
import ChoiceGroup from '../../inputs/choice-group/choice-group'
import ShareBar from '../../content/share-bar/share-bar'
import PullRequestSummaryCard, {
  PullRequestState
} from '../../cards/pull-request-summary-card/pull-request-summary-card'
import PullRequestPickerList, {
  PullRequestPickerOwner,
  PullRequestPickerRow
} from '../../lists/pull-request-picker-list/pull-request-picker-list'
import {
  Section,
  FieldLabel,
  CommentBox,
  CommentBar,
  CommentAvatar,
  CommentUser,
  CommentMeta,
  CommentText,
  CommentTextarea,
  PreviewHead
} from './import-pull-request-dialog.styles'

export type ImportPullRequestMode = 'fixed' | 'custom'
export type ImportPullRequestStep = 'form' | 'preview' | 'posted'

export type ResolvedPullRequest = {
  repo: string
  number: number
  title: string
  state: PullRequestState
}

export type ImportPullRequestDialogProps = {
  open: boolean
  onClose: () => void
  initialStep?: ImportPullRequestStep

  pullRequestUrl: string
  onPullRequestUrlChange: (url: string) => void
  resolvedPullRequest?: ResolvedPullRequest
  resolvingPullRequest?: boolean

  connected?: boolean
  onConnectGithub?: () => void
  pullRequests?: PullRequestPickerRow[]
  loadingPullRequests?: boolean
  owners?: PullRequestPickerOwner[]
  pickedPullRequestNumber?: number
  onPickedPullRequestChange?: (pullRequestNumber: number) => void

  mode: ImportPullRequestMode
  onModeChange: (mode: ImportPullRequestMode) => void
  price: string
  onPriceChange: (price: string) => void

  viewerUsername: string
  comment: string
  onCommentChange?: (comment: string) => void
  shareUrl: string

  onSubmit?: () => void
  onPost?: () => Promise<void> | void
}

const ImportPullRequestDialog = ({
  open,
  onClose,
  initialStep = 'form',
  pullRequestUrl,
  onPullRequestUrlChange,
  resolvedPullRequest,
  resolvingPullRequest = false,
  connected = false,
  onConnectGithub,
  pullRequests = [],
  loadingPullRequests = false,
  owners = [],
  pickedPullRequestNumber,
  onPickedPullRequestChange,
  mode,
  onModeChange,
  price,
  onPriceChange,
  viewerUsername,
  comment,
  onCommentChange,
  shareUrl,
  onSubmit,
  onPost
}: ImportPullRequestDialogProps) => {
  const intl = useIntl()
  const [step, setStep] = React.useState<ImportPullRequestStep>(initialStep)
  const [editingComment, setEditingComment] = React.useState(false)
  const [posting, setPosting] = React.useState(false)
  const [pickerFilter, setPickerFilter] = React.useState<'open' | 'closed'>('open')
  const [pickerOwner, setPickerOwner] = React.useState('all')
  const [pickerRepo, setPickerRepo] = React.useState('all')

  React.useEffect(() => {
    if (open) setStep(initialStep)
  }, [open, initialStep])

  const titleIcon = <img src={githubLogo} alt="" width={20} height={20} />

  const handleSubmit = () => {
    onSubmit?.()
    setStep('preview')
  }

  const handleBack = () => setStep('form')

  const handlePost = async () => {
    setPosting(true)
    await onPost?.()
    setPosting(false)
    setStep('posted')
  }

  if (step === 'posted') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          icon={titleIcon}
          onClose={onClose}
          title={intl.formatMessage({
            id: 'design.importPullRequestDialog.title',
            defaultMessage: 'Import pull request'
          })}
        />
        <DialogContent>
          <CustomAlert severity="success" completed>
            <AlertTitle>
              <FormattedMessage
                id="design.importPullRequestDialog.posted.title"
                defaultMessage="Posted successfully"
              />
            </AlertTitle>
            {resolvedPullRequest && (
              <Typography variant="body2">
                <FormattedMessage
                  id="design.importPullRequestDialog.posted.description"
                  defaultMessage="Your payment request is on {repo} #{number}."
                  values={{ repo: resolvedPullRequest.repo, number: resolvedPullRequest.number }}
                />
              </Typography>
            )}
          </CustomAlert>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={onClose}
            label={
              <FormattedMessage id="design.importPullRequestDialog.close" defaultMessage="Close" />
            }
          />
          <Button
            variant="outlined"
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.viewOnGithub"
                defaultMessage="View on GitHub"
              />
            }
            {...{
              component: 'a',
              href: pullRequestUrl,
              target: '_blank',
              rel: 'noopener noreferrer'
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.viewPaymentRequests"
                defaultMessage="View payment requests"
              />
            }
          />
        </DialogActions>
      </Dialog>
    )
  }

  if (step === 'preview') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          icon={titleIcon}
          onClose={onClose}
          title={intl.formatMessage({
            id: 'design.importPullRequestDialog.previewTitle',
            defaultMessage: 'Payment link created'
          })}
        />
        <DialogContent>
          <Section>
            <div>
              <PreviewHead>
                <FieldLabel style={{ margin: 0 }}>
                  <FormattedMessage
                    id="design.importPullRequestDialog.preview"
                    defaultMessage="Preview"
                  />
                </FieldLabel>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setEditingComment((current) => !current)}
                  label={
                    editingComment ? (
                      <FormattedMessage
                        id="design.importPullRequestDialog.done"
                        defaultMessage="Done"
                      />
                    ) : (
                      <FormattedMessage
                        id="design.importPullRequestDialog.edit"
                        defaultMessage="Edit"
                      />
                    )
                  }
                />
              </PreviewHead>
              <CommentBox>
                <CommentBar>
                  <CommentAvatar>{viewerUsername.charAt(0).toUpperCase()}</CommentAvatar>
                  <CommentUser>{viewerUsername}</CommentUser>
                  {resolvedPullRequest && (
                    <CommentMeta>
                      <FormattedMessage
                        id="design.importPullRequestDialog.willComment"
                        defaultMessage="will comment on {repo} #{number}"
                        values={{
                          repo: resolvedPullRequest.repo,
                          number: resolvedPullRequest.number
                        }}
                      />
                    </CommentMeta>
                  )}
                </CommentBar>
                {editingComment ? (
                  <CommentTextarea
                    value={comment}
                    onChange={(e) => onCommentChange?.(e.target.value)}
                  />
                ) : (
                  <CommentText>{comment}</CommentText>
                )}
              </CommentBox>
            </div>
            <ShareBar url={shareUrl} />
          </Section>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleBack}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.editStep"
                defaultMessage="Edit"
              />
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePost}
            completed={!posting}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.post"
                defaultMessage="Post in pull request"
              />
            }
          />
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        icon={titleIcon}
        onClose={onClose}
        title={intl.formatMessage({
          id: 'design.importPullRequestDialog.title',
          defaultMessage: 'Import pull request'
        })}
      />
      <DialogContent>
        <Section>
          <div>
            <FieldLabel>
              <FormattedMessage
                id="design.importPullRequestDialog.urlLabel"
                defaultMessage="Pull request URL"
              />
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={pullRequestUrl}
              onChange={(e) => onPullRequestUrlChange(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              InputProps={
                !connected && onConnectGithub
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            size="small"
                            onClick={onConnectGithub}
                            startIcon={<img src={githubLogo} alt="" width={15} height={15} />}
                            label={
                              <FormattedMessage
                                id="design.importPullRequestDialog.connectGithub"
                                defaultMessage="Connect GitHub"
                              />
                            }
                          />
                        </InputAdornment>
                      )
                    }
                  : undefined
              }
            />
            {!connected && resolvingPullRequest && (
              <div style={{ marginTop: 12 }}>
                <PullRequestSummaryCard
                  repo=""
                  number={0}
                  title=""
                  state="open"
                  completed={false}
                />
              </div>
            )}
            {!connected && !resolvingPullRequest && resolvedPullRequest && (
              <div style={{ marginTop: 12 }}>
                <PullRequestSummaryCard {...resolvedPullRequest} />
              </div>
            )}
            {connected && (
              <div style={{ marginTop: 12 }}>
                <PullRequestPickerList
                  pullRequests={pullRequests}
                  owners={owners}
                  loading={loadingPullRequests}
                  value={pickedPullRequestNumber}
                  onChange={(number) => onPickedPullRequestChange?.(number)}
                  filter={pickerFilter}
                  onFilterChange={setPickerFilter}
                  owner={pickerOwner}
                  onOwnerChange={setPickerOwner}
                  repo={pickerRepo}
                  onRepoChange={setPickerRepo}
                />
              </div>
            )}
          </div>

          <div>
            <FieldLabel>
              <FormattedMessage
                id="design.importPullRequestDialog.amount"
                defaultMessage="Amount"
              />
            </FieldLabel>
            <ChoiceGroup
              value={mode}
              onChange={onModeChange}
              options={[
                {
                  value: 'fixed',
                  title: intl.formatMessage({
                    id: 'design.importPullRequestDialog.fixedTitle',
                    defaultMessage: 'Fixed amount'
                  }),
                  description: intl.formatMessage({
                    id: 'design.importPullRequestDialog.fixedDescription',
                    defaultMessage: 'You set the price. The payer pays that amount.'
                  })
                },
                {
                  value: 'custom',
                  title: intl.formatMessage({
                    id: 'design.importPullRequestDialog.customTitle',
                    defaultMessage: 'Custom amount'
                  }),
                  description: intl.formatMessage({
                    id: 'design.importPullRequestDialog.customDescription',
                    defaultMessage: 'The payer chooses how much to pay.'
                  })
                }
              ]}
            />
          </div>

          {mode === 'fixed' ? (
            <div>
              <FieldLabel>
                <FormattedMessage
                  id="design.importPullRequestDialog.price"
                  defaultMessage="Price"
                />
              </FieldLabel>
              <TextField
                fullWidth
                size="small"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: <InputAdornment position="end">USD</InputAdornment>
                }}
              />
            </div>
          ) : (
            <SimpleInfo
              text={
                <FormattedMessage
                  id="design.importPullRequestDialog.customNote"
                  defaultMessage="The payment page shows an open amount field in USD."
                />
              }
            />
          )}
        </Section>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={onClose}
          label={
            <FormattedMessage id="design.importPullRequestDialog.cancel" defaultMessage="Cancel" />
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          label={
            <FormattedMessage
              id="design.importPullRequestDialog.createLink"
              defaultMessage="Create payment link"
            />
          }
        />
      </DialogActions>
    </Dialog>
  )
}

export default ImportPullRequestDialog
