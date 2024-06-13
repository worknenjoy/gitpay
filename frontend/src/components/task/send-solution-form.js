import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  FormControl,
  FilledInput,
  InputAdornment,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GitHubIcon from '@material-ui/icons/GitHub'

const useStyles = makeStyles({
  customInput: {
    padding: '12px 14px', // Customize padding as needed
  },
})

const SendSolutionForm = props => {
  const classes = useStyles()
  return (
    <form>
      <FormControl fullWidth>
        <FormattedMessage id='task.solution.form.solutionURL' defaultMessage='Pull Request URL' >
          { (msg) => (
            <FilledInput
              id='solution-url'
              endAdornment={ <InputAdornment position='end'><GitHubIcon size={ 16 } /></InputAdornment> }
              placeholder={ msg }
              type='string'
              value={ props.pullRequestURL }
              onChange={ props.handlePullRequestURLChange }
              inputProps={ { className: classes.customInput, 'data-testid': 'pull-request-url' } }

            />
          ) }
        </FormattedMessage>
      </FormControl>
    </form>
  )
}

export default SendSolutionForm
