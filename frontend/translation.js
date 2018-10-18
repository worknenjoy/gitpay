const extractReactIntl = require('extract-react-intl')

const pattern = 'src/**/*.js'
const locales = ['en', 'br']

extractReactIntl(locales, pattern).then(result => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result))

  /*
{
  en:
   { 'components/App/hello': 'hello',
     'components/App/welcome': 'welcome to extract-react-intl' }
  ja:
   { 'components/App/hello': '',
     'components/App/world': '' }
}
  */
})
