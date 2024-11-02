import { IntlProvider } from 'react-intl';
import {
  MuiThemeProvider,
  createTheme
} from '@material-ui/core'
import { addDecorator } from '@storybook/react';
import '../src/main/app.css';
import messagesEnLocal from '../src/translations/generated/en.json';
import Palette from '../src/components/styles/palette';

const theme = createTheme(Palette)

const withIntl = (Story, context) => {
  const { locale = 'en' } = context.globals;
  return (
    <IntlProvider locale={locale} messages={messagesEnLocal[locale]}>
      <Story />
    </IntlProvider>
  );
};

const withMuiTheme = (Story) => (
  <MuiThemeProvider theme={ theme }>
    <Story />
  </MuiThemeProvider>
);

addDecorator(withIntl);
addDecorator(withMuiTheme);

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'br', right: '🇪🇸', title: 'Portuguese' },
      ],
    },
  },
};


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
