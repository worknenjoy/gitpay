import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  FormControl,
  FilledInput,
  InputAdornment,
} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'

const SendSolutionForm = props => {
  return (
    <form>
      <FormControl fullWidth>
        <FormattedMessage id='task.solution.form.solutionURL' defaultMessage='Pull Request URL' >
          { (msg) => (
            <FilledInput
              id='solution-url'
              endAdornment={ <InputAdornment position='end'><GitHubIcon /></InputAdornment> }
              placeholder={ msg }
              type='string'
              value={ props.pullRequestURL }
              onChange={ props.handlePullRequestURLChange }
            />
          ) }
        </FormattedMessage>
      </FormControl>
    </form>
  )
}

export default SendSolutionForm
