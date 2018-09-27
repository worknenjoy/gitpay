import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider, addLocaleData } from 'react-intl'

import messagesBr from './translations/br.json'
import messagesEn from './translations/en.json'

import localeEn from 'react-intl/locale-data/en'
import localeBr from 'react-intl/locale-data/br'

addLocaleData([...localeEn, ...localeBr])

const messages = {
  'br': messagesBr,
  'en': messagesEn
}

const language = navigator.language.split(/[-_]/)[0]

import App from './main/app'

ReactDOM.render(
  <IntlProvider locale={ language } messages={ messages[language] }>
    <App />
  </IntlProvider>,
  document.getElementById('app'))
