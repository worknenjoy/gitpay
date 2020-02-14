import React from 'react'
import SubscribeFrom from 'react-mailchimp-subscribe'
import {
  red,
  cyan,
  teal
} from '@material-ui/core/colors'
import { injectIntl, defineMessages } from 'react-intl'

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

const SubscribeForm = ({ intl, type, render }) => {
  const formProps = {
    action:
      '//truppie.us17.list-manage.com/subscribe/post?u=bb76ecd5ef5cbbc5e60701321&amp;id=63cbedd527',
    messages: {
      inputPlaceholder: intl.formatMessage(msgs.mainFormLeaveMail),
      btnLabel: intl.formatMessage(msgs.mainFormSignup),
      sending: intl.formatMessage(msgs.mainFormSubscribing),
      success: intl.formatMessage(msgs.mainFormSubmitSuccess),
      error: intl.formatMessage(msgs.mainFormSubmitError)
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

  return (
    render ? <SubscribeFrom { ...formProps } className={ type || {} } /> : null
  )
}

export default injectIntl(SubscribeForm)
