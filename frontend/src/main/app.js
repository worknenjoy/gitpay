import React, { useEffect, useState } from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { IntlProvider, updateIntl } from 'react-intl-redux'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'

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
import Loader from '../components/loader/loader'

addLocaleData([...localeEn, ...localeBr])

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-114655639-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
  LogRocket.init('ie8a2g/gitpay')
  setupLogRocketReact(LogRocket)
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

function App () {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(false)
  }, [isLoading])
  if (!isLoading) {
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
  else {
    return <Loader />
  }
}
export default App
