import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import {
  withStyles,
  Paper,
  Grid,
  Button
} from '@material-ui/core'

import { FormattedMessage, injectIntl } from 'react-intl'
import DeleteUser from './settings/deleteUser'

const styles = theme => ({
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.light
    }
  }
})

class Settings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deleteUserDialog: false
    }
  }

  handleDelete = () => {
    this.setState({ deleteUserDialog: true })
  }

  deleteUser = (user) => {
    this.props.deleteUser(user).then(response => {
      this.props.history.push('/')
    }).catch(e => {
      // eslint-disable-next-line no-console
      console.log(e)
    })
  }

  render () {
    const { classes } = this.props

    return (
      <Paper elevation={ 0 }>
        <Grid container alignItems='center' spacing={ 1 }>
          <Grid item xs={ 5 } style={ { marginBottom: 20 } }>
            <Button onClick={ this.handleDelete }
              variant='contained'
              className={ classes.deleteButton }
            >
              <FormattedMessage id='account.profile.settings.delete.user.title' defaultMessage='Delete my account' />
            </Button>
            <DeleteUser
              deleteUser={ this.deleteUser }
              user={ this.props.user }
              visible={ this.state.deleteUserDialog }
              onClose={ () => this.setState({ deleteUserDialog: false }) }
              onOpen={ () => this.setState({ deleteUserDialog: true }) }
            />
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default injectIntl(withRouter(withStyles(styles)(Settings)))
