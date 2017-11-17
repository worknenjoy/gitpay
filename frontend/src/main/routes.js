import React from 'react'
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router'

import Welcome from '../components/welcome/welcome'

export default props => (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome} />
        <Redirect from='*' to='/' />
    </Router>
)
