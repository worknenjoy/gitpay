import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider, addLocaleData } from 'react-intl'

import messages_br from "./translations/br.json"
import messages_en from "./translations/en.json"

import locale_en from 'react-intl/locale-data/en'
import locale_br from 'react-intl/locale-data/br'

addLocaleData([...locale_en, ...locale_br]);

const messages = {
    'br': messages_br,
    'en': messages_en
};

const language = navigator.language.split(/[-_]/)[0];

import App from './main/app'

ReactDOM.render(
    <IntlProvider locale={ language } messages={ messages[language] }>
        <App/>
    </IntlProvider>,
document.getElementById('app'))
