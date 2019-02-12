import React from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { IntlProvider, updateIntl } from 'react-intl-redux'

import {
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import Palette from '../components/styles/palette'
import './app.css'
import ReactGA from 'react-ga'

import Routes from './routes'
import NotificationContainer from '../containers/notification'

import reducers from '../reducers/reducers'

import { addLocaleData } from 'react-intl'

import messagesBr from '../translations/result/br.json'
import messagesEn from '../translations/result/en.json'

import localeEn from 'react-intl/locale-data/en'
import localeBr from 'react-intl/locale-data/br'

addLocaleData([...localeEn, ...localeBr])

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-114655639-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
}

const messages = {
  'br': messagesBr,
  'en': messagesEn
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

/* eslint-disable no-undef */
const currentLang = localStorage.getItem('userLanguage') || 'en'

store.dispatch(updateIntl({
  locale: currentLang,
  messages: messages[currentLang],
}))

const theme = createMuiTheme(Palette)

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
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
