import React, { Component } from 'react'
import styled, { css } from 'styled-components'
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

const Wrapper = styled.div`

  ${props => props.contrast && css`
    color: white;
  `}
`

const Content = styled.div`
  margin-top: 10px;
`

class LoginButton extends Component {

  componentWillMount () {
    const referer = this.props.referer.pathname
    if (referer) {
      Auth.storeReferer(referer)
    }
  }

  render () {
    const { classes, contrast, size } = this.props

    return (
      <Wrapper contrast={ contrast }>
        <Typography type='subheading' color={ contrast ? 'inherit' : 'default' } gutterBottom noWrap>
          Conecte com algumas dessas contas
        </Typography>

        <Content>
          <Button
            style={ { marginRight: 10 } }
            href={ `${api.API_URL}/authorize/github` }
            variant='raised'
            size={ size }
            color='secondary'
            className={ classes.logButtons }
          >
            <img width='16' src={ logoGithub } />
            <span className={ classes.gutterLeft }>Github</span>
          </Button>

          <Button
            href={ `${api.API_URL}/authorize/bitbucket` }
            variant='raised'
            size={ size }
            color='secondary'
            className={ classes.logButtons }
          >
            <img width='16' src={ logoBitbucket } />
            <span className={ classes.gutterLeft }>Bitbucket</span>
          </Button>

        </Content>
      </Wrapper>
    )
  }
}

LoginButton.propTypes = {
  classes: PropTypes.object.isRequired,
  referer: PropTypes.object,
  contrast: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
}

LoginButton.defaultProps = {
  size: 'large'
}

export default withStyles(styles)(LoginButton)
