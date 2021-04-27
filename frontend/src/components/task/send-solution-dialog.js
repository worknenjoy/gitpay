import React, { useState } from 'react'
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

const SendSolution = props => {
  const [solutionURL, setSolutionURL] = useState('')
  const [isConnectedToGitHub, setIsConnectedToGitHub] = useState(false)
  const [isAuthorOfPR, setIsAuthorOfPR] = useState(false)
  const [isPRMerged, setIsPRMerged] = useState(false)
  const [isIssueClosed, setIsIssueClosed] = useState(false)

  const handleSolutionURLChange = (event) => {
    setSolutionURL(event.target.value)
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
        <SendSolutionForm handleSolutionURLChange={ handleSolutionURLChange } solutionURL={ solutionURL } />
        <SendSolutionRequirements isConnectedToGitHub={ isConnectedToGitHub } isAuthorOfPR={ isAuthorOfPR } isPRMerged={ isPRMerged } isIssueClosed={ isIssueClosed } />
      </DialogContent>
      <DialogActions>
        <Button onClick={ props.handleAssignFundingDialogClose } color='primary'>
          <FormattedMessage id='task.bounties.actions.cancel' defaultMessage='Cancel' />
        </Button>
        <Button type='primary' htmlFor='submit' variant='contained' color='primary' disabled={ !solutionURL }>
          <FormattedMessage id='task.solution.form.send' defaultMessage='Send Solution' />
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}

export default SendSolution
