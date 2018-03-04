import React, { Component } from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';

export default class Session extends Component {

  constructor(props) {
    super(props);
    const token = props.params.token
    reactLocalStorage.set('token', token);
  }

  componentWillMount() {
    console.log('session route starts');
    this.props.router.push("/");
  }

  render() {
    return (
      <div>hello</div>
    )
  }
}
