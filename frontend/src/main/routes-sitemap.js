import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default (
  <Route>
    <Route exact path='/' />
    <Route path='/recruitment' />
    <Redirect path='/tasks/explore' to='/tasks/open' />
    <Route path='/tasks/createdbyme' />
    <Route path='/tasks/interested' />
    <Route path='/tasks/assignedtome' />
    <Route path='/tasks/all' />
    <Route path='/tasks/open' />
    <Route path='/tasks/progress' />
    <Route path='/tasks/finished' />
    <Route exact path='/login' />
  </Route>
)
