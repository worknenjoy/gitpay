import React, { useEffect, useState } from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { thunk } from 'redux-thunk'
import { IntlProvider, updateIntl } from 'react-intl-redux'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { getCookieConsentValue } from 'react-cookie-consent'

import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Palette from '../styleguide/styles/palette'
import './app.css'
import ReactGA from 'react-ga'

import Routes from './routes'
import NotificationContainer from '../containers/shared/notification'

import reducers from '../reducers/reducers'

import messagesBr from '../translations/result/br.json'
import messagesEn from '../translations/result/en.json'

import messagesBrLocal from '../translations/generated/br.json'
import messagesEnLocal from '../translations/generated/en.json'
import Loader from '../components/design-library/atoms/loaders/loader/loader'

import CookieConsentBar, { GITPAY_COOKIE_CONSENT } from './cookie-consent-bar'

const cookieConsent = getCookieConsentValue(GITPAY_COOKIE_CONSENT)

if (process.env.NODE_ENV === 'production' && cookieConsent) {
  ReactGA.initialize('UA-114655639-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
  LogRocket.init('ie8a2g/gitpay')
  setupLogRocketReact(LogRocket)
}

const messages = {
  br: process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  en: process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const composeEnhancers =
  typeof window === 'object' &&
  process.env.NODE_ENV === 'development' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
)

export const store = createStore(reducers, enhancer)

/* eslint-disable no-undef */
const currentLang = localStorage.getItem('userLanguage') || 'en'

store.dispatch(
  updateIntl({
    locale: currentLang,
    messages: messages[currentLang]
  })
)

const theme = createTheme(Palette)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(false)
  }, [isLoading, getCookieConsentValue])
  if (!isLoading) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <IntlProvider>
              <div>
                <CssBaseline />
                <NotificationContainer />
                <Routes />
                <CookieConsentBar />
              </div>
            </IntlProvider>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    )
  } else {
    return <Loader />
  }
}
export default App
