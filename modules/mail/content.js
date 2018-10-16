const i18n = require('i18n')

const Signatures = {}

Signatures.sign = (language) => {
  const language = user.language || 'en'
  i18n.setLocale(language)
  return `

<p>
${i18n.__('mail.payment.sign.thanks')}, <br />
${i18n.__('mail.payment.sign.team')}
</p>
----------------------

<p>
https://gitpay.me (Web) <br />
tarefas@gitpay.me (Email) <br />
Worknenjoy Inc., 2035 Sunset Lake Road #Suite B-2, Newark, DE 19702 (Mail) <br />
</p>
`
}

module.exports = Signatures
