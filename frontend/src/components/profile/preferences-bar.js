import React, { Component } from 'react'
import { AppBar, Toolbar, Grid, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'

class PreferencesBar extends Component {
  render () {
    const { classes } = this.props

    return (
      <AppBar
        component='div'
        className={ classes.thirdBar }
        color='default'
        position='static'
        elevation={ 0 }>
        <Toolbar>
          <Grid container alignItems='center' spacing={ 1 }>
            <Grid item xs style={ { paddingTop: 15, paddingBottom: 15 } }>
              <Typography color='primary' variant='body1' gutterBottom>
                <FormattedMessage id='preferences.subtitle' defaultMessage='Setup your preferences about skill and how you should receive the notifications about new tasks and projects' />
              </Typography>
              <Typography variant='body2' color='textSecondary' gutterBottom>
                <FormattedMessage id='preferences.subtitle2' defaultMessage='You can onboard accounts to receive payments using our supported countries or link your account with Paypal (that will include Paypal fees)' />
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

PreferencesBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(withRouter(PreferencesBar))
