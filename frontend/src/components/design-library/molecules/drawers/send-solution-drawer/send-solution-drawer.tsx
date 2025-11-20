import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SendSolutionForm from '../../../atoms/inputs/solution-input/solution-input'
import { Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { validAccount } from '../../../../../utils/valid-account'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'
import SendSolutionRequirements from '../../../../areas/public/features/issue/legacy/send-solution-requirements'
import Drawer from 'design-library/molecules/drawers/drawer/drawer'
import IssueSolutionCard from 'design-library/molecules/cards/issue-cards/issue-solution-card/issue-solution-card'

const SendSolutionDrawer = ({
  taskSolution,
  task,
  user,
  fetchAccount,
  account,
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  open,
  onClose,
  cleanPullRequestDataState,
  fetchPullRequestData,
  pullRequestData,
  taskSolutionCompleted
}) => {
  const history = useHistory()
  const [pullRequestURL, setPullRequestURL] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    user?.data?.id && task?.data?.id && getTaskSolution(task.data.id)
  }, [user, task])

  useEffect(() => {
    cleanPullRequestDataState()
  }, [])

  useEffect(() => {
    if (pullRequestURL.length >= 20) {
      clearTimeout(timer)
      setTimer(
        setTimeout(() => {
          const urlSplitted = pullRequestURL.split('/')
          fetchPullRequestData(urlSplitted[3], urlSplitted[4], urlSplitted[6], task.data.id)
        }, 2500)
      )
    }
  }, [pullRequestURL])

  useEffect(() => {
    fetchAccount()
  }, [])

  const handlePullRequestURLChange = (event) => {
    setPullRequestURL(event.target.value)
  }

  const handleTaskSolutionUpdate = () => {
    setEditMode(true)
  }

  const submitTaskSolution = () => {
    if (editMode) {
      const payload = {
        pullRequestURL: pullRequestURL,
        taskId: task.data.id,
        taskSolutionId: taskSolution.id
      }
      updateTaskSolution(payload).then((solution) => {})
      setEditMode(false)
      // eslint-disable-next-line no-useless-return
      return
    }

    const payload = { ...pullRequestData, pullRequestURL: pullRequestURL, taskId: task.data.id }

    createTaskSolution(payload).then((solution) => {})
  }

  const taskValue = task?.data?.value

  const shouldDisableForNoBountyAvailable =
    taskValue === '0' || taskValue === null || taskValue === '' || isNaN(Number(taskValue))

  return (
    <React.Fragment>
      <Drawer
        open={open}
        onClose={onClose}
        title={
          <FormattedMessage
            id="task.solution.dialog.message"
            defaultMessage="Send a solution for this issue"
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
          Object.keys(taskSolution || {}).length !== 0 && !editMode
            ? {
                onClick: handleTaskSolutionUpdate,
                label: (
                  <FormattedMessage id="task.solution.form.edit" defaultMessage="Edit Solution" />
                ),
                variant: 'contained',
                color: 'primary',
                disabled: task?.data?.paid || task?.data?.Transfer || task?.data?.transfer_id
              }
            : {
                onClick: submitTaskSolution,
                label: (
                  <FormattedMessage id="task.solution.form.send" defaultMessage="Send Solution" />
                ),
                variant: 'contained',
                color: 'primary',
                disabled:
                  !pullRequestURL ||
                  !pullRequestData.isConnectedToGitHub ||
                  !pullRequestData.isAuthorOfPR ||
                  !pullRequestData.isPRMerged ||
                  !pullRequestData.isIssueClosed ||
                  !pullRequestData.hasIssueReference ||
                  shouldDisableForNoBountyAvailable ||
                  task.data.paid ||
                  task.data.transfer_id ||
                  task.data.Transfer ||
                  !validAccount(user?.data, account)
              }
        ]}
      >
        <Typography variant="body2" style={{ color: 'black' }} gutterBottom>
          <FormattedMessage
            id="task.solution.dialog.description"
            defaultMessage="You can send a solution for this issue providing the Pull Request / Merge Request URL of your solution:"
          />
        </Typography>
        <AccountRequirements
          user={user?.data}
          account={account}
          onClick={() => history.push('/profile/payout-settings')}
        />
        {Object.keys(taskSolution || {}).length === 0 || editMode ? (
          <React.Fragment>
            <SendSolutionForm
              handlePullRequestURLChange={handlePullRequestURLChange}
              pullRequestURL={pullRequestURL}
            />
            <SendSolutionRequirements
              completed={taskSolutionCompleted}
              isConnectedToGitHub={pullRequestData.isConnectedToGitHub}
              isAuthorOfPR={pullRequestData.isAuthorOfPR}
              isPRMerged={pullRequestData.isPRMerged}
              isIssueClosed={pullRequestData.isIssueClosed}
              hasIssueReference={pullRequestData.hasIssueReference}
              bountyAvailable={Number(task?.data?.value) && !task?.data?.paid}
            />
          </React.Fragment>
        ) : (
          <IssueSolutionCard taskSolution={taskSolution} task={task.data} />
        )}
      </Drawer>
    </React.Fragment>
  )
}

export default SendSolutionDrawer
