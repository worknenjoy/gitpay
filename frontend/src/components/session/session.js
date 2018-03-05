import React, { Component } from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';

export default class Session extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //console.log('session route starts');
    const token = this.props.params.token;
    localStorage.setItem('token', token);
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
