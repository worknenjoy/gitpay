const i18n = require('i18n')

const Signatures = {}

Signatures.sign = (language) => {
  i18n.setLocale(language || 'en')
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

Signatures.buttons = (language, buttons) => {
  i18n.setLocale(language || 'en')
  return `

<table style="margin-top: 20px" width="100%" cellspacing="0" cellpadding="0">
  <tr>
      <td>
          <table cellspacing="20" cellpadding="0">
              <tr>
                  <td style="border-radius: 2px;" bgcolor="#26a69a;">
                      <a href="${buttons.primary.url}" target="_blank" style="padding: 8px 12px; border: 1px solid #004d40;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                          ${i18n.__(buttons.primary.label)}             
                      </a>
                  </td>
                  <!--
                  <td style="border-radius: 2px;" bgcolor="#26a69a;">
                      <a href="${buttons.secondary.url}" target="_blank" style="padding: 8px 12px; border: 1px solid #004d40;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                          ${i18n.__(buttons.secondary.label)}             
                      </a>
                  </td>
                  -->
              </tr>
          </table>
      </td>
  </tr>
</table>
`
}

module.exports = Signatures
