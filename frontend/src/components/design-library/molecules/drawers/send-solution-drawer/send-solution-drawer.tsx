import React, { useState, useEffect } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import TransferEligibilityInfo from 'design-library/atoms/alerts/transfer-eligibility-info/transfer-eligibility-info'
import Drawer from 'design-library/molecules/drawers/drawer/drawer'
import IssueSolutionCard from 'design-library/molecules/cards/issue-cards/issue-solution-card/issue-solution-card'
import SolutionPrField, {
  MyPullRequest
} from 'design-library/molecules/form-section/solution-pr-field/solution-pr-field'
import SolutionChecklistCard from 'design-library/molecules/cards/solution-checklist-card/solution-checklist-card'
import {
  getSolutionChecklist,
  canSubmitSolution,
  hasBountyAvailable,
  isBountyLocked
} from 'design-library/organisms/layouts/page-layouts/issue-page-layout/issue-page.helpers'
import { Body, RequestPayment } from './send-solution-drawer.styles'

type SendSolutionDrawerProps = {
  taskSolution: any
  task: any
  user: any
  getTaskSolution: (taskId: number) => void
  createTaskSolution: (payload: any) => Promise<any>
  updateTaskSolution: (payload: any) => Promise<any>
  open: boolean
  onClose: () => void
  cleanPullRequestDataState: () => void
  fetchPullRequestData: (owner: string, repo: string, pullNumber: string, taskId: number) => void
  pullRequestData: any
  taskSolutionCompleted?: boolean
  /** Contributor's own PRs for the picker. Omit → plain URL input. */
  myPullRequests?: MyPullRequest[]
  /** GitHub login when connected. */
  connectedAs?: string
  onConnectGithub?: () => void
  /** Send the solution and ask the maintainer for payment when there's no bounty. Omit → hidden. */
  onRequestPayment?: (payload: { pullRequestURL: string; taskId: number }) => void
  /** Called after a solution is created or updated (e.g. to show a toast). */
  onSent?: () => void
}

const SendSolutionDrawer = ({
  taskSolution,
  task,
  user,
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  open,
  onClose,
  cleanPullRequestDataState,
  fetchPullRequestData,
  pullRequestData,
  taskSolutionCompleted,
  myPullRequests,
  connectedAs,
  onConnectGithub,
  onRequestPayment,
  onSent
}: SendSolutionDrawerProps) => {
  const [pullRequestURL, setPullRequestURL] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [requestPayment, setRequestPayment] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const taskData = task?.data
  const bountyAvailable = hasBountyAvailable(taskData)
  const hasSolution = Object.keys(taskSolution || {}).length !== 0

  useEffect(() => {
    user?.data?.id && taskData?.id && getTaskSolution(taskData.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, task])

  useEffect(() => {
    cleanPullRequestDataState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pullRequestURL.length >= 20) {
      clearTimeout(timer)
      setTimer(
        setTimeout(() => {
          const urlSplitted = pullRequestURL.split('/')
          fetchPullRequestData(urlSplitted[3], urlSplitted[4], urlSplitted[6], taskData.id)
        }, 2500)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pullRequestURL])

  const submitTaskSolution = async () => {
    if (editMode) {
      await updateTaskSolution({
        pullRequestURL,
        taskId: taskData.id,
        taskSolutionId: taskSolution.id
      })
      setEditMode(false)
      onSent?.()
      return
    }
    await createTaskSolution({ ...pullRequestData, pullRequestURL, taskId: taskData.id })
    onSent?.()
  }

  const showRequestPayment = !bountyAvailable && Boolean(onRequestPayment)
  const canSend = canSubmitSolution({ pullRequestURL, pullRequestData, taskData })
  const canRequest =
    showRequestPayment &&
    requestPayment &&
    Boolean(pullRequestURL) &&
    pullRequestData?.isAuthorOfPR &&
    !isBountyLocked(taskData)

  const sendAction =
    hasSolution && !editMode
      ? {
          onClick: () => setEditMode(true),
          label: <FormattedMessage id="task.solution.form.edit" defaultMessage="Edit Solution" />,
          variant: 'contained',
          color: 'primary',
          disabled: isBountyLocked(taskData)
        }
      : {
          onClick: () => {
            if (canRequest && !canSend) {
              onRequestPayment({ pullRequestURL, taskId: taskData.id })
              return
            }
            submitTaskSolution()
          },
          label: <FormattedMessage id="task.solution.form.send" defaultMessage="Send Solution" />,
          variant: 'contained',
          color: 'primary',
          disabled: !(canSend || canRequest)
        }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        <FormattedMessage
          id="task.solution.dialog.message"
          defaultMessage="Send a solution for this issue"
        />
      }
      subtitle={
        <FormattedMessage
          id="task.solution.dialog.lede"
          defaultMessage="Pick the pull request that solves this issue, or paste its URL."
        />
      }
      actions={[
        {
          label: <FormattedMessage id="task.bounties.actions.cancel" defaultMessage="Cancel" />,
          onClick: onClose,
          variant: 'text',
          color: 'default',
          disabled: false
        },
        sendAction
      ]}
    >
      <Body>
        <TransferEligibilityInfo user={user?.data} />
        {!hasSolution || editMode ? (
          <>
            <SolutionPrField
              value={pullRequestURL}
              onChange={setPullRequestURL}
              myPullRequests={myPullRequests}
              connectedAs={connectedAs}
              onConnect={onConnectGithub}
            />
            <SolutionChecklistCard
              completed={taskSolutionCompleted !== false}
              items={getSolutionChecklist({ pullRequestData, bountyAvailable })}
            />
            {showRequestPayment && (
              <RequestPayment>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={requestPayment}
                      onChange={(e) => setRequestPayment(e.target.checked)}
                    />
                  }
                  label={
                    <span>
                      <b>
                        <FormattedMessage
                          id="task.solution.requestPayment"
                          defaultMessage="Request payment from the maintainer"
                        />
                      </b>
                      <em>
                        <FormattedMessage
                          id="task.solution.requestPayment.description"
                          defaultMessage="There is no bounty yet. The maintainer gets your request with the solution."
                        />
                      </em>
                    </span>
                  }
                />
              </RequestPayment>
            )}
          </>
        ) : (
          <IssueSolutionCard taskSolution={taskSolution} task={taskData} />
        )}
      </Body>
    </Drawer>
  )
}

export default SendSolutionDrawer
