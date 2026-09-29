import { defineMessages } from 'react-intl'

// Content posted as a real GitHub comment (not on-screen UI), so it's built with
// react-intl's standalone createIntl (see containers/payment/import-pull-request.ts)
// rather than <FormattedMessage> — but it goes through the same message catalog as
// everything else, so it's still translated for non-English users.
const messages = defineMessages({
  commentIntroFixed: {
    id: 'pullRequest.comment.intro.fixed',
    defaultMessage:
      "If you'd like to support the work on this pull request, I'm asking **{price} USD** — totally optional."
  },
  commentIntroCustom: {
    id: 'pullRequest.comment.intro.custom',
    defaultMessage:
      "If you'd like to support the work on this pull request, any amount is welcome — totally optional."
  },
  commentPayHere: {
    id: 'pullRequest.comment.payHere',
    defaultMessage: '**[Pay here]({url})**'
  },
  commentFooter: {
    id: 'pullRequest.comment.footer',
    defaultMessage:
      '_[Gitpay](https://gitpay.me) lets you send payments directly to contributors for work delivered on GitHub._'
  }
})

export default messages
