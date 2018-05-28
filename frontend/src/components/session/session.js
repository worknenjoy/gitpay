import React, { Component } from 'react';
import Auth from '../../modules/auth';

export default class Session extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const token = this.props.match.params.token;
    Auth.authenticateUser(token);
    this.props.history.replace("/profile");
  }

  render() {
    return (
      <div>
        Session created
      </div>
    )
  }
}
