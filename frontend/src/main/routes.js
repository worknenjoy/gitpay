import React from 'react'
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router'

import Auth from '../auth/auth'

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={Auth} />       
        <Redirect from='*' to='/' />
    </Router>
)