import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

const languages = {
  'br': 'Português',
  'en': 'English'
}

class Preferences extends Component {
  render () {
    return (
      <Paper elevation={ 0 }>
        <Typography variant='headline' component='h3'>
          <FormattedMessage id='preferences.headline' defaultMessage='Preferences' />
        </Typography>
        <Typography component='p' style={ { marginBottom: 40 } }>
          <FormattedMessage id='preferences.subtitle' defaultMessage='Setup your account' />
        </Typography>
        <Typography component='p' style={ { marginBottom: 10 } }>
          <strong><FormattedMessage id='preferences.language.name' defaultMessage='Language' /></strong> { languages[this.props.preferences.language] }
        </Typography>
        <Typography component='p' style={ { marginBottom: 40 } }>
          <strong><FormattedMessage id='preferences.language.currency' /></strong>
          <FormattedMessage id='preferences.language.currency.name' defaultMessage='USD (Dolars)' />
        </Typography>
      </Paper>
    )
  }
}

export const PreferencesPure = Preferences
export default withRouter(Preferences)
