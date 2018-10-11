const extractReactIntl = require('extract-react-intl')

const pattern = 'src/components/**/*.js'
const locales = ['en', 'br']

extractReactIntl(locales, pattern).then(result => {
  console.log(result)
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