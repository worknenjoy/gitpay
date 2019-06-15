import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import If from '../operator/if'

class InputAuth extends Component {
  render () {
    const { hide, label, type, name, value } = this.props

    return (
      <If test={ !hide }>
        <TextField
          hintText={ label }
          floatingLabelText={ label }
          type={ type }
          name={ name }
          value={ value }
        />
      </If>
    )
  }
}

InputAuth.propTypes = {
  hide: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
}

export default InputAuth
