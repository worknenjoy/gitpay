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
export type ImportPullRequestStep = 'form' | 'review' | 'done'

export type ResolvedPullRequest = {
  repo: string
  number: number
  title: string
  state: PullRequestState
  /** The PR's GitHub URL, as resolved from the pasted URL. */
  url?: string
}

export type ImportPullRequestDialogProps = {
  open: boolean
  onClose: () => void
  initialStep?: ImportPullRequestStep

  pullRequestUrl: string
  onPullRequestUrlChange: (url: string) => void
  resolvedPullRequest?: ResolvedPullRequest
  resolvingPullRequest?: boolean

  mode: ImportPullRequestMode
  onModeChange: (mode: ImportPullRequestMode) => void
  price: string
  onPriceChange: (price: string) => void

  viewerUsername: string
  /** Read-only preview of the comment that will be posted, shown on the review step before the
   * payment request (and its real payment link) exist — the link is a placeholder until then. */
  previewComment?: string
  comment: string
  onCommentChange?: (comment: string) => void
  shareUrl: string
  /** Whether the comment has already been posted to the PR (set after Create & post, or after Post in pull request from the done step). */
  posted?: boolean

  /** Creates the payment request only — does not post a comment. */
  onCreate?: () => Promise<void>
  /** Creates the payment request and immediately posts the comment. */
  onCreateAndPost?: () => Promise<void>
  /** Posts the comment for an already-created payment request (from the done step, if not posted yet). */
  onPostNow?: () => Promise<void>
  onViewPaymentRequests?: () => void
}

const ImportPullRequestDialog = ({
  open,
  onClose,
  initialStep = 'form',
  pullRequestUrl,
  onPullRequestUrlChange,
  resolvedPullRequest,
  resolvingPullRequest = false,
  mode,
  onModeChange,
  price,
  onPriceChange,
  viewerUsername,
  previewComment,
  comment,
  onCommentChange,
  shareUrl,
  posted = false,
  onCreate,
  onCreateAndPost,
  onPostNow,
  onViewPaymentRequests
}: ImportPullRequestDialogProps) => {
  const intl = useIntl()
  const [step, setStep] = React.useState<ImportPullRequestStep>(initialStep)
  const [editingComment, setEditingComment] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [posting, setPosting] = React.useState(false)

  React.useEffect(() => {
    if (open) setStep(initialStep)
  }, [open, initialStep])

  const titleIcon = <img src={githubLogo} alt="" width={20} height={20} />

  const handleContinue = () => setStep('review')
  const handleBackToForm = () => setStep('form')

  // Failures here (e.g. the account isn't activated for payments) are already surfaced to the
  // user via the global notification toast, dispatched from the same redux action that raises
  // this rejection — catching it here just keeps the dialog open on the review step instead of
  // crashing the app with an unhandled rejection.
  const handleCreate = async () => {
    setSubmitting(true)
    try {
      await onCreate?.()
      setStep('done')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create the payment request', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateAndPost = async () => {
    setSubmitting(true)
    try {
      await onCreateAndPost?.()
      setStep('done')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create and post the payment request', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePostNow = async () => {
    setPosting(true)
    try {
      await onPostNow?.()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to post the pull request comment', error)
    } finally {
      setPosting(false)
    }
  }

  const handleViewPaymentRequests = () => {
    onClose()
    onViewPaymentRequests?.()
  }

  if (step === 'done') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          icon={titleIcon}
          onClose={onClose}
          title={
            posted
              ? intl.formatMessage({
                  id: 'design.importPullRequestDialog.posted.title',
                  defaultMessage: 'Posted successfully'
                })
              : intl.formatMessage({
                  id: 'design.importPullRequestDialog.previewTitle',
                  defaultMessage: 'Payment link created'
                })
          }
        />
        <DialogContent>
          {posted ? (
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
          ) : (
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
          )}
        </DialogContent>
        <DialogActions>
          {posted ? (
            <>
              <Button
                variant="text"
                onClick={handleViewPaymentRequests}
                label={
                  <FormattedMessage
                    id="design.importPullRequestDialog.viewPaymentRequests"
                    defaultMessage="View payment requests"
                  />
                }
              />
              <Button
                variant="contained"
                color="primary"
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
            </>
          ) : (
            <>
              <Button
                variant="text"
                onClick={onClose}
                label={
                  <FormattedMessage
                    id="design.importPullRequestDialog.close"
                    defaultMessage="Close"
                  />
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePostNow}
                completed={!posting}
                label={
                  <FormattedMessage
                    id="design.importPullRequestDialog.post"
                    defaultMessage="Post in pull request"
                  />
                }
              />
            </>
          )}
        </DialogActions>
      </Dialog>
    )
  }

  if (step === 'review') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          icon={titleIcon}
          onClose={onClose}
          title={intl.formatMessage({
            id: 'design.importPullRequestDialog.reviewTitle',
            defaultMessage: 'Review payment request'
          })}
        />
        <DialogContent>
          <Section>
            {resolvedPullRequest && <PullRequestSummaryCard {...resolvedPullRequest} />}
            <div>
              <FieldLabel>
                <FormattedMessage
                  id="design.importPullRequestDialog.amount"
                  defaultMessage="Amount"
                />
              </FieldLabel>
              <Typography variant="body2">
                {mode === 'fixed' ? (
                  <FormattedMessage
                    id="design.importPullRequestDialog.reviewFixedAmount"
                    defaultMessage="{price} USD"
                    values={{ price: `$${price}` }}
                  />
                ) : (
                  <FormattedMessage
                    id="design.importPullRequestDialog.reviewCustomAmount"
                    defaultMessage="Custom amount"
                  />
                )}
              </Typography>
            </div>
            {previewComment && (
              <div>
                <FieldLabel>
                  <FormattedMessage
                    id="design.importPullRequestDialog.preview"
                    defaultMessage="Preview"
                  />
                </FieldLabel>
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
                  <CommentText>{previewComment}</CommentText>
                </CommentBox>
              </div>
            )}
            <SimpleInfo
              text={
                <FormattedMessage
                  id="design.importPullRequestDialog.reviewNote"
                  defaultMessage="We'll post a comment with your payment link on this pull request — you can review it before posting."
                />
              }
            />
          </Section>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleBackToForm}
            disabled={submitting}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.editStep"
                defaultMessage="Back"
              />
            }
          />
          <Button
            variant="outlined"
            onClick={handleCreate}
            disabled={submitting}
            completed={!submitting}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.createOnly"
                defaultMessage="Create"
              />
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAndPost}
            disabled={submitting}
            completed={!submitting}
            label={
              <FormattedMessage
                id="design.importPullRequestDialog.createAndPost"
                defaultMessage="Create and post"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={githubLogo} alt="" width={15} height={15} />
                  </InputAdornment>
                )
              }}
            />
            {!resolvingPullRequest && !resolvedPullRequest && (
              <div style={{ marginTop: 12 }}>
                <SimpleInfo
                  text={
                    <FormattedMessage
                      id="design.importPullRequestDialog.urlHint"
                      defaultMessage="Paste the URL of a merged pull request you authored."
                    />
                  }
                />
              </div>
            )}
            {resolvingPullRequest && (
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
            {!resolvingPullRequest && resolvedPullRequest && (
              <div style={{ marginTop: 12 }}>
                <PullRequestSummaryCard {...resolvedPullRequest} />
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
          onClick={handleContinue}
          disabled={!resolvedPullRequest}
          label={
            <FormattedMessage
              id="design.importPullRequestDialog.continue"
              defaultMessage="Continue"
            />
          }
        />
      </DialogActions>
    </Dialog>
  )
}

export default ImportPullRequestDialog
