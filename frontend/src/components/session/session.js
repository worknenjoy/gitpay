import React, { Component } from 'react';
import Auth from '../../modules/auth';

export default class Session extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //console.log('session route starts');
    const token = this.props.params.token;
    Auth.authenticateUser(token);
    this.props.router.push("/profile");
  }

  render() {
    return (
      <div>
        Session created
      </div>
    )
  }
}
