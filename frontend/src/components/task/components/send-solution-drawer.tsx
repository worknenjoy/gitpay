import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import SendSolutionForm from '../send-solution-form'
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { validAccount } from '../../../utils/valid-account'
import AccountRequirements from '../../../components/design-library/molecules/account-requirements/account-requirements'
import SendSolutionRequirements from '../send-solution-requirements'
import TaskSolution from '../task-solution'
import Drawer from '../../design-library/molecules/drawer/drawer'

const SendSolutionDialog = props => {
  const [pullRequestURL, setPullRequestURL] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const { taskSolution, pullRequestData, task, user, fetchAccount, account, history } = props

  useEffect(() => {
    user.id && task.data.id && props.getTaskSolution(user.id, task.data.id)
  }, [user, task])

  useEffect(() => {
    props.cleanPullRequestDataState()
  }, [props.assignDialog])

  useEffect(() => {
    if (pullRequestURL.length >= 20) {
      clearTimeout(timer)
      setTimer(setTimeout(() => {
        const urlSplitted = pullRequestURL.split('/')
        props.fetchPullRequestData(urlSplitted[3], urlSplitted[4], urlSplitted[6], props.user.id, task.data.id)
      }, 2500))
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
      const payload = { pullRequestURL: pullRequestURL, taskId: task.data.id, userId: props.user.id, taskSolutionId: taskSolution.id }
      props.updateTaskSolution(payload).then((solution) => {
        
      })
      setEditMode(false)
      // eslint-disable-next-line no-useless-return
      return
    }

    const payload = { ...pullRequestData, pullRequestURL: pullRequestURL, taskId: task.data.id, userId: props.user.id }

    props.createTaskSolution(payload).then((solution) => {
      
    })
  }

  /*
  if(!user.id) {
    return <Redirect to='/signin' />
  }
  */

  return (
    <React.Fragment>
      <Drawer
        open={ props.open }
        onClose={ props.onClose }
        title={ <FormattedMessage id='task.solution.dialog.message' defaultMessage='Send a solution for this issue' /> }
        actions={[
          {
            label: <FormattedMessage id='task.bounties.actions.cancel' defaultMessage='Cancel' />,
            onClick: props.onClose,
            variant: 'contained',
            color: 'primary',
            disabled: false,
          },
          Object.keys(props.taskSolution).length !== 0 && !editMode 
            ? 
            {
              onclick: handleTaskSolutionUpdate,
              label: <FormattedMessage id='task.solution.form.edit' defaultMessage='Edit Solution' />, 
              variant: 'contained',
              color: 'primary',
              disabled: task.data.paid || task.data.Transfer || task.data.transfer_id,
            }
            :
            {
              onclick: submitTaskSolution,
              label: <FormattedMessage id='task.solution.form.send' defaultMessage='Send Solution' />, 
              variant: 'contained',
              color: 'primary',
              disabled: !pullRequestURL ||
              !pullRequestData.isConnectedToGitHub ||
              !pullRequestData.isAuthorOfPR ||
              !pullRequestData.isPRMerged ||
              !pullRequestData.isIssueClosed ||
              !pullRequestData.hasIssueReference ||
              task.data.paid ||
              task.data.transfer_id ||
              task.data.Transfer ||
              !validAccount(user, account),
            }
        ]}

      >
        <Typography variant='body2' style={ { color: 'black' } } gutterBottom>
          <FormattedMessage id='task.solution.dialog.description' defaultMessage='You can send a solution for this issue providing the Pull Request / Merge Request URL of your solution:' />
        </Typography>
        <AccountRequirements
          user={ user }
          account={ account }
          onClick={() => history.push('/profile/user-account/payouts')}
        />
        { Object.keys(props.taskSolution).length === 0 || editMode
          ? <React.Fragment>
            <SendSolutionForm handlePullRequestURLChange={ handlePullRequestURLChange } pullRequestURL={ pullRequestURL } />
            <SendSolutionRequirements completed={ props.completed } isConnectedToGitHub={ pullRequestData.isConnectedToGitHub } isAuthorOfPR={ pullRequestData.isAuthorOfPR } isPRMerged={ pullRequestData.isPRMerged } isIssueClosed={ pullRequestData.isIssueClosed } hasIssueReference={ pullRequestData.hasIssueReference } />
          </React.Fragment>
          : <TaskSolution taskSolution={ taskSolution } task={task.data} />
        }
      </Drawer>  
    </React.Fragment>
  )
}

export default withRouter(SendSolutionDialog)
