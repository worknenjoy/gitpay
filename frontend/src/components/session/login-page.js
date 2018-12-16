import React, { Component } from 'react'
import styled from 'styled-components'

import LoginButton from './login-button'

const Content = styled.div`
  margin-top: 10px;
`

class LoginPage extends Component {
  render () {
    return (
      <Content>
        <LoginButton includeForm />
      </Content>
    )
  }
}

export default LoginPage
