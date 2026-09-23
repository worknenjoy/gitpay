import React, { Component } from 'react'

import { Card, CardContent } from '@mui/material'
import Input from '../../common/form/inputAuth'

export const cardStyle = {
  minWidth: 275,
  position: 'relative'
}

export class Auth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loginMode: true,
      username: '',
      email: '',
      password: ''
    }

    this.changeMode = this.changeMode.bind(this)
  }
  changeMode() {
    this.setState({ loginMode: !this.state.loginMode, ...this.state })
  }
  onSubmit() {
    // eslint-disable-next-line no-console
    console.log(this.state)
  }
  render() {
    return (
      <Card className="container" style={cardStyle}>
        <form onSubmit={() => this.onSubmit()}>
          <h2 className="card-heading">Login</h2>
          <div className="field-line">
            <Input
              label="Name"
              type="text"
              name="username"
              hide={this.state.loginMode}
              value="this.state.username"
            />
            <br />
            <Input label="E-mail" type="text" name="email" value={this.state.email} />
            <br />
            <Input label="Password" name="password" type="password" value={this.state.password} />
          </div>

          <CardContent>
            <a onClick={() => this.changeMode()}>
              {this.state.loginMode
                ? 'New user? Register here!'
                : 'Already registered? Come in here!'}
            </a>
          </CardContent>
        </form>
      </Card>
    )
  }
}

export default Auth
