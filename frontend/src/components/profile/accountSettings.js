import React, { Component } from 'react'
import { injectIntl } from 'react-intl'

import {
  Typography,
  Button,
  withStyles,
  TextField,
  InputAdornment,
  Link,
  Checkbox
} from '@material-ui/core'

import bcrypt from 'bcrypt-nodejs'

import api from '../../consts'

import PersonIcon from '@material-ui/icons/Person'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'

const styles = theme => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10% 0 3% 0',
    '& p': {
      fontSize: '1.5rem'
    }
  },
  divider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: '1.25rem',
    '& hr': {
      width: '10%',
      height: '5%',
      margin: '1.25% 1% 0 1%',
      color: 'rgb(220,220,220,0.3)'
    },
    [theme.breakpoints.down('sm')]: {
      '& hr': {
        width: '10%',
        height: '5%',
        margin: '3% 1% 0 1%',
        color: 'rgb(220,220,220,0.3)'
      }
    }
  },
  providerBtns: {
    display: 'flex',
    justifyContent: 'center',
    '& a': {
      margin: '2% 1%',
      width: '25%',
      fontSize: '1.25rem',
      backgroundColor: '#1239ff'
    },
    '& a:hover': {
      backgroundColor: '#1239ff'
    },
    [theme.breakpoints.down('sm')]: {
      '& a': {
        margin: '2% 1%',
        width: '35%',
        fontSize: '1rem',
        backgroundColor: '#1239ff'
      },
      '& a:hover': {
        backgroundColor: '#1239ff'
      },
    }
  },
  form: {
    '& form': {
      display: 'flex',
      flexDirection: 'column',
      margin: '2% 0',
      justifyContent: 'center',
      alignItems: 'center',
      '& > div': {
        margin: '1% 0',
        width: '55%'
      },
      [theme.breakpoints.down('sm')]: {
        '& > div': {
          margin: '2% 0',
          width: '70%'
        },
      }
    }
  },
  checkboxes: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0% 0 0 23%',
    '& button': {
      width: '71%',
      margin: '2% 0 0 0',
      fontSize: '1.2rem',
      backgroundColor: '#1239ff'
    },
    '& button:hover': {
      backgroundColor: '#1239ff'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 0 15%',
      '& button': {
        margin: '5% 0 0 0',
        width: '81%',
        fontSize: '1rem',
      },
      '& button:hover': {
        backgroundColor: '#1239ff'
      },
    },
  },
  tnc: {
    display: 'flex',
    flexDirection: 'row',
    '& span': {
      paddingTop: '0'
    }
  },
  newsletter: {
    display: 'flex',
    flexDirection: 'row',
    '& span': {
      paddingTop: '0'
    }
  },
})

class AccountSettings extends Component {
    state={
      name: this.props.user.name || '',
      email: this.props.user.email || '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
      provider: this.props.user.provider || '',
      save: false,
      checkedConditions: false,
      newsletter: false
    }

    componentDidUpdate = () => {
    //   console.dir('old pass is correct :', bcrypt.compareSync(this.state.oldPassword, this.props.user.password))
      if (this.state.name !== '' &&
            this.state.email !== '' &&
            this.state.oldPassword !== '' &&
            this.state.save === true &&
            this.state.password === this.state.confirmPassword &&
            this.state.checkedConditions === true &&
            // eslint-disable-next-line no-sync
            bcrypt.compareSync(this.state.oldPassword, this.props.user.password) === true
      ) {
        this.handleSave()
      }
    }
    handleName = (element) => {
      this.setState({ name: element.target.value })
    }
    handleEmail = (element) => {
      this.setState({ email: element.target.value })
    }
    handleOldPassword = (element) => {
      this.setState({ oldPassword: element.target.value })
    }
    handlePassword = (element) => {
      this.setState({ password: element.target.value })
    }
    handleConfirmPassword = (element) => {
      this.setState({ confirmPassword: element.target.value })
    }
    handleProvider = (element) => {
      this.setState({ provider: element.target.value })
    }
    handleUpdate = (e) => {
      if (this.state.checkedConditions === true && this.state.oldPassword !== '') {
        e.preventDefault()
        this.setState({ save: true })
      }
    }
    handleIsConditionChecked = (e) => {
      if (this.state.checkedConditions !== true) {
        this.setState({ checkedConditions: true })
      }
      else {
        this.setState({ checkedConditions: false })
      }
    }
    handleIsnewsletterChecked = (e) => {
      if (this.state.newsletter !== true) {
        this.setState({ newsletter: true })
      }
      else {
        this.setState({ newsletter: false })
      }
    }
    handleSave =() => {
      this.props.updateUser(this.props.user.id, {
        name: this.state.name.length > 0 ? this.state.name : this.props.user.name,
        email: this.state.email.length > 0 ? this.state.email : this.props.user.email,
        password: this.state.password !== '' ? this.state.password : this.state.oldPassword
      })
        .then(() => {
          // eslint-disable-next-line no-console
          console.dir('update user called')
        })
    }
    render () {
      // eslint-disable-next-line no-console
      console.dir(this.state, this.props)
      // eslint-disable-next-line no-unused-vars
      const { classes, user, preferences, roles, organizations } = this.props
      return (
        <React.Fragment>
          <div className={ classes.header }>
            <Typography variant='h4' color='textPrimary' component='p' wrap>
                    CHANGE YOUR
            </Typography>
            <Typography variant='h4' color='textPrimary' component='p' wrap>
                    ACCOUNT SETUP
            </Typography>
          </div>
          <div className={ classes.divider }>
            <hr />
            <Typography variant='h5' color='textSecondary' component='p' wrap>
                        PROVIDER
            </Typography>
            <hr />
          </div>
          <div className={ classes.providerBtns }>
            <Button variant='contained' color='primary' disabled={ user.provider === 'github' } href={ `${api.API_URL}/authorize/github` }>
                    GITHUB
            </Button>
            <Button variant='contained' color='primary' disabled={ user.provider === 'bitbucket' } href={ `${api.API_URL}/authorize/bitbucket` }>
                    BITBUCKET
            </Button>
          </div>
          <div className={ classes.divider }>
            <hr />
            <Typography variant='h5' color='textSecondary' component='p' wrap>
                        OR
            </Typography>
            <hr />
          </div>
          <div className={ classes.form }>
            <form>
              <TextField id='outlined-basic' label='Full Name' variant='outlined' onChange={ this.handleName }
                value={ this.state.name }
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon style={ { color: '#2a60e4' } } />
                    </InputAdornment>), } } />
              <TextField disabled id='outlined-basic' label='Email Address' variant='outlined' onChange={ this.handleEmail }
                value={ this.state.email }
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailIcon style={ { color: '#2a60e4' } } />
                    </InputAdornment>
                  ),
                } } />
              <TextField id='outlined-password-input' label='Old Password' variant='outlined' onChange={ this.handleOldPassword }
                type='password'
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon style={ { color: '#2a60e4' } } />
                    </InputAdornment>
                  ),
                } } />
              <TextField id='outlined-password-input' label='New Password' variant='outlined' onChange={ this.handlePassword }
                type='password'
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon style={ { color: '#2a60e4' } } />
                    </InputAdornment>
                  ),
                } } />
              <TextField id='outlined-password-input' label='Confirm Password' variant='outlined' onChange={ this.handleConfirmPassword }
                type='password'
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon style={ { color: '#2a60e4' } } />
                    </InputAdornment>
                  ),
                } } />
            </form>
          </div>
          <div className={ classes.checkboxes }>
            <div className={ classes.tnc }>
              <Checkbox onChange={ this.handleIsConditionChecked } inputProps={ { 'aria-label': 'uncontrolled-checkbox' } } />
              <Typography variant='subtitle1' color='textPrimary' component='p' wrap>
                            I agree to the&nbsp; <Link href='#' style={ { color: '#3e6ee6' } } >T & C's</Link> &nbsp;and&nbsp; <Link href='#' style={ { color: '#3e6ee6' } } >Privacy Policy</Link>
              </Typography>
            </div>
            <div className={ classes.newsletter }>
              <Checkbox onChange={ this.handleIsnewsletterChecked } inputProps={ { 'aria-label': 'uncontrolled-checkbox' } } />
              <Typography variant='subtitle1' color='textPrimary' component='p' wrap>
                            Sign up to the newsletter
              </Typography>
            </div>
            <Button variant='contained' color='primary' onClick={ this.handleUpdate }>
                        UPDATE ACCOUNT
            </Button>
          </div>
        </React.Fragment>
      )
    }
}
export default injectIntl(withStyles(styles)(AccountSettings))
