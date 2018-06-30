import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Auth from '../../modules/auth'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const logoGithub = require('../../images/github-logo.png')
const logoBitbucket = require('../../images/bitbucket-logo.png')

import api from '../../consts'

const styles = theme => ({
  gutterLeft: {
    marginLeft: 10
  }
})

class LoginButton extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {
    const referer = this.props.referer.pathname
    if (referer) {
      Auth.storeReferer(referer)
    }
  }

  render () {
    const { classes, contrast } = this.props

    return (
      <div style={contrast ? {} : {color: 'white'}}>
        <Typography type='subheading' color={ contrast ? 'default' : 'inherit' } gutterBottom noWrap>
          Conecte com algumas dessas contas
        </Typography>
        <Button
          style={ { marginRight: 10 } }
          href={ `${api.API_URL}/authorize/github` }
          variant='raised'
          size='large'
          color='secondary'
          className={ classes.logButtons }
        >
          <img width='16' src={ logoGithub } />
          <span className={ classes.gutterLeft }>Github</span>
        </Button>
        <Button
          href={ `${api.API_URL}/authorize/bitbucket` }
          variant='raised'
          size='large'
          color='secondary'
          className={ classes.logButtons }
        >
          <img width='16' src={ logoBitbucket } />
          <span className={ classes.gutterLeft }>Bitbucket</span>
        </Button>
      </div>
    )
  }
}

LoginButton.propTypes = {
  classes: PropTypes.object.isRequired,
  referer: PropTypes.object,
  contrast: PropTypes.bool
}

export default withStyles(styles)(LoginButton)
