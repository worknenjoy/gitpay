import React from 'react'
import { useIntl } from 'react-intl'
import { FormControl, FilledInput, InputAdornment } from '@mui/material'
import { GitHub as GitHubIcon } from '@mui/icons-material'
import { solutionInputSx } from './solution-input.styles'

const SolutionInput = (props) => {
  const intl = useIntl()
  return (
    <form>
      <FormControl fullWidth>
        <FilledInput
          id="solution-url"
          endAdornment={
            <InputAdornment position="end">
              <GitHubIcon fontSize="small" />
            </InputAdornment>
          }
          placeholder={intl.formatMessage({
            id: 'task.solution.form.solutionURL.placeholder',
            defaultMessage: 'Enter Pull Request URL'
          })}
          type="string"
          value={props.pullRequestURL}
          onChange={props.handlePullRequestURLChange}
          sx={solutionInputSx}
          inputProps={{ 'data-testid': 'pull-request-url' }}
        />
      </FormControl>
    </form>
  )
}

export default SolutionInput
