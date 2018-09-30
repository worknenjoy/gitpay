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

import { addLocaleData } from 'react-intl'
import { IntlProvider, updateIntl } from 'react-intl-redux'

import messagesBr from '../translations/br.json'
import messagesEn from '../translations/en.json'

import localeEn from 'react-intl/locale-data/en'
import localeBr from 'react-intl/locale-data/br'

addLocaleData([...localeEn, ...localeBr])

const messages = {
  'br': messagesBr,
  'en': messagesEn
}

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

export const store = createStore(
  reducers,
  enhancer
)

const theme = createMuiTheme(Palette)

function App () {
  return (
    <MuiThemeProvider theme={ theme }>
      <Provider store={ store }>
        <IntlProvider>
          <div>
            <NotificationContainer />
            <Routes />
          </div>
        </IntlProvider>                
      </Provider>
    </MuiThemeProvider>
  )
}

export default App
