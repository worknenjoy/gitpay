import React, { Component } from 'react'

import App from './app'
import Auth from '../auth/auth'

class AuthOrApp extends Component {

    render() {
        return <Auth />
    }
}

export default AuthOrApp