import React, { useState, useEffect } from 'react'
import SendSolutionForm from './send-solution-form'
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import SendSolutionRequirements from './send-solution-requirements'
import TaskSolution from './task-solution'
import notification from '../../containers/notification'

const SendSolutionDialog = props => {
  const [pullRequestURL, setPullRequestURL] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [timer, setTimer] = useState()

  const { taskSolution, pullRequestData } = props

  useEffect(() => {
    props.getTaskSolution(props.user.id, props.task.id)
  }, [props.user, props.task])

  useEffect(() => {
    props.cleanPullRequestDataState()
  }, [props.assignDialog])

  useEffect(() => {
    if (pullRequestURL.length >= 43) {
      clearTimeout(timer)
      setTimer(setTimeout(() => {
        const urlSplitted = pullRequestURL.split('/')
        props.fetchPullRequestData(urlSplitted[3], urlSplitted[4], urlSplitted[6], props.user.id, props.task.id)
      }, 2500))
    }
  }, [pullRequestURL])

  const handlePullRequestURLChange = (event) => {
    setPullRequestURL(event.target.value)
  }

  const handleTaskSolutionUpdate = () => {
    setEditMode(true)
  }

  const submitTaskSolution = () => {
    console.log('submitTaskSolution', props)
    if (editMode) {
      const payload = { pullRequestURL: pullRequestURL, taskId: props.task.id, userId: props.user.id, taskSolutionId: taskSolution.id }
      props.updateTaskSolution(payload)
      setEditMode(false)

      // eslint-disable-next-line no-useless-return
      return
    }

    const payload = { ...pullRequestData, pullRequestURL: pullRequestURL, taskId: props.task.id, userId: props.user.id }

    props.createTaskSolution(payload).then((solution) => {
      console.log('solution', solution)
    })
  }

  return (
    <React.Fragment>
      <DialogTitle>
        <Typography type='headline' variant='h6' style={ { color: 'black' } } gutterBottom>
          <FormattedMessage id='task.solution.dialog.message' defaultMessage='Send a solution for this issue' />
        </Typography>
        <Typography variant='body2' style={ { color: 'black' } } gutterBottom>
          <FormattedMessage id='task.solution.dialog.description' defaultMessage='You can send a solution for this issue providing the Pull Request / Merge Request URL of your solution:' />
        </Typography>
      </DialogTitle>
      <DialogContent>
        { Object.keys(props.taskSolution).length === 0 || editMode
          ? <React.Fragment>
            <SendSolutionForm handlePullRequestURLChange={ handlePullRequestURLChange } pullRequestURL={ pullRequestURL } />
            <SendSolutionRequirements completed={ props.completed } isConnectedToGitHub={ pullRequestData.isConnectedToGitHub } isAuthorOfPR={ pullRequestData.isAuthorOfPR } isPRMerged={ pullRequestData.isPRMerged } isIssueClosed={ pullRequestData.isIssueClosed } />
          </React.Fragment>
          : <TaskSolution taskSolution={ taskSolution } />
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={ props.handleAssignFundingDialogClose } color='primary'>
          <FormattedMessage id='task.bounties.actions.cancel' defaultMessage='Cancel' />
        </Button>
        { Object.keys(props.taskSolution).length !== 0 && !editMode // Edit mode will change the button to "send solution"
          ? <Button type='primary' htmlFor='submit' variant='contained' color='primary' onClick={ handleTaskSolutionUpdate } disabled={ props.task.paid }>
            <FormattedMessage id='task.solution.form.edit' defaultMessage='Edit Solution' />
          </Button>
          : <Button type='primary' htmlFor='submit' variant='contained' color='primary' disabled={
            !pullRequestURL || !pullRequestData.isConnectedToGitHub || !pullRequestData.isAuthorOfPR || !pullRequestData.isPRMerged || !pullRequestData.isIssueClosed
          } onClick={ submitTaskSolution }>
            <FormattedMessage id='task.solution.form.send' defaultMessage='Send Solution' />
          </Button>
        }
      </DialogActions>
    </React.Fragment>
  )
}

export default SendSolutionDialog
