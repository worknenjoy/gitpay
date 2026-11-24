import { IntlProvider } from 'react-intl'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter as Router } from 'react-router-dom'
import { addDecorator } from '@storybook/react'
import '../src/main/app.css'
import messagesEnLocal from '../src/translations/generated/en.json'
import Palette from '../src/styleguide/styles/palette'
import { withReduxStore } from './decorators/withReduxStore'

const theme = createTheme(Palette)

const withIntl = (Story, context) => {
  const { locale = 'en' } = context.globals
  return (
    <IntlProvider locale={locale} messages={messagesEnLocal[locale]}>
      <Story />
    </IntlProvider>
  )
}

const withMuiTheme = (Story) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
)

const withRouter = (Story) => (
  <Router>
    <Story />
  </Router>
)

addDecorator(withIntl)
addDecorator(withMuiTheme)
addDecorator(withRouter)
// The topbar / account header in the page templates render Redux-connected
// containers (e.g. ImportPullRequest), so every story needs a store.
addDecorator(withReduxStore)

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'br', right: '🇧🇷', title: 'Português' }
      ]
    }
  }
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },

  backgrounds: {
    default: 'white',
    values: [
      { name: 'black', value: '#000000' },
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#888888' }
    ]
  }
}
