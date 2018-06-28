import React from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Palette from '../components/styles/palette'
import './app.css'
import ReactGA from 'react-ga'

import Routes from './routes'
import NotificationContainer from '../containers/notification'

import reducers from '../reducers/reducers'

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-114655639-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
}

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(thunkMiddleware),
  // other store enhancers if any
)

const store = createStore(
  reducers,
  enhancer
  /* compose(
    applyMiddleware(
      thunkMiddleware
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ) */
)

const theme = createMuiTheme(Palette)

function App () {
  return (
    <MuiThemeProvider theme={ theme }>
      <Provider store={ store }>
        <div>
          <NotificationContainer />
          <Routes />
        </div>
      </Provider>
    </MuiThemeProvider>
  )
}

export default App
