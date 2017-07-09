import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import App from './app'
import Auth from '../auth/auth'

class AuthOrApp extends Component {

    render() {
        return <Auth />
    }
}

const mapStateToProps = state => ({ auth: state.auth })
export default connect(mapStateToProps)(AuthOrApp)