// CardSection.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import {
  Input,
  InputAdornment,
  FormControl,
  FormHelperText
} from '@material-ui/core'
import {
  AccountCircle,
  Email
} from '@material-ui/icons'

class UserSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: {
        fullname: false,
        email: false
      }
    }

    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
  }

  componentWillReceiveProps (props, newProps) {
    if (props !== newProps) {
      this.setState({
        error: props.error
      })
    }
  }

  onChangeName (ev) {
    if (ev.target.value.length < 1) {
      this.setState({ error: { fullname: true } })
    }
    else {
      this.setState({ error: { fullname: false } })
    }
  }

  onChangeEmail (ev) {
    if (ev.target.value.length < 1) {
      this.setState({ error: { email: true } })
    }
    else {
      this.setState({ error: { email: false } })
    }
  }

  render () {
    return (
      <label>
        <FormControl error={ this.state.error.fullname }>
          <FormattedMessage id='user.data.fullname' defaultMessage='Full name'>
            { (msg) => (
              <Input
                id='payment-form-user'
                name='fullname'
                startAdornment={
                  <InputAdornment position='start'>
                    <AccountCircle />
                  </InputAdornment>
                }
                placeholder={ msg }
                ref='payment-form-user'
                defaultValue={ this.props.name }
                required
                style={ { marginRight: 20 } }
                onChange={ this.onChangeName }
              />
            ) }
          </FormattedMessage>
          { this.state.error.fullname && (
            <FormattedMessage id='user.data.fullname.error' defaultMessage='Provide your full name'>
              { (msg) => (
                <FormHelperText error={ this.state.error.fullname }>
                  { msg }
                </FormHelperText>
              ) }
            </FormattedMessage>
          ) }
        </FormControl>
        <FormControl error={ this.state.error.email }>
          <Input
            name='email'
            id='adornment-email'
            startAdornment={
              <InputAdornment position='start'>
                <Email />
              </InputAdornment>
            }
            placeholder='e-mail'
            ref='payment-form-email'
            type='email'
            disabled={ this.props.email }
            defaultValue={ this.props.email }
            required
            onChange={ this.onChangeEmail }
          />
          { this.state.error.email && (
            <FormattedMessage id='user.data.email.error' defaultMessage='Provide your email correctly'>
              { (msg) => (
                <FormHelperText error={ this.state.error.email }>
                  { msg }
                </FormHelperText>
              ) }
            </FormattedMessage>
          ) }
        </FormControl>
      </label>
    )
  }
}

UserSection.propTypes = {
  error: PropTypes.object.isRequired,
  email: PropTypes.string,
  name: PropTypes.string
}

export default UserSection
