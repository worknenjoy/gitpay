import { red, cyan, teal } from 'material-ui/colors'
import { IntlProvider, defineMessages } from 'react-intl'
import messagesBr from '../../translations/br.json'
import messagesEn from '../../translations/en.json'

const messages = {
  'br': messagesBr,
  'en': messagesEn
}

const msgs = defineMessages({
  mainFormLeaveMail: {
    id: 'form.email.leave.label',
    defaultMessage: 'Leave your email'
  },
  mainFormSignup: {
    id: 'form.email.signup.label',
    defaultMessage: 'Signup!'
  },
  mainFormSubscribing: {
    id: 'form.email.subscribing.label',
    defaultMessage: 'Subscribing...'
  },
  mainFormSubmitSuccess: {
    id: 'form.email.submit.success',
    defaultMessage: 'You now registered and soon you will receive new challenges'
  },
  mainFormSubmitError: {
    id: 'form.email.submit.error',
    defaultMessage: 'We could not register your e-mail, maybe you\'re already registered?'
  }
})

/* eslint-disable no-undef */
const locale = localStorage.getItem('userLanguage')
const finalLocale = locale || 'en'

const { intl } = new IntlProvider({ locale: finalLocale, messages: messages[finalLocale] }, {}).getChildContext()

const translate = (key) => {
  return intl.formatMessage(key) || ''
}

export default {
  action:
    '//truppie.us17.list-manage.com/subscribe/post?u=bb76ecd5ef5cbbc5e60701321&amp;id=63cbedd527',
  messages: {
    inputPlaceholder: translate(msgs.mainFormLeaveMail),
    btnLabel: translate(msgs.mainFormSignup),
    sending: translate(msgs.mainFormSubscribing),
    success: translate(msgs.mainFormSubmitSuccess),
    error: translate(msgs.mainFormSubmitError)
  },
  styles: {
    sending: {
      fontSize: 14,
      color: cyan['500']
    },
    success: {
      fontSize: 14,
      color: teal['500']
    },
    error: {
      fontSize: 14,
      backgroundColor: teal['200'],
      display: 'inline-block',
      opacity: 0.8,
      padding: 10,
      color: red['700']
    }
  }
}
