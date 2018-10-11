import { red, cyan, teal } from 'material-ui/colors'

export default {
  action:
    '//truppie.us17.list-manage.com/subscribe/post?u=bb76ecd5ef5cbbc5e60701321&amp;id=63cbedd527',
  messages: {
    inputPlaceholder: 'Leave your email',
    btnLabel: 'Signup!',
    sending: 'Subscribing...',
    success: 'You now registered and soon you will receive new challenges',
    error:
      'We could not register your e-mail, maybe you\'re already registered?'
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
