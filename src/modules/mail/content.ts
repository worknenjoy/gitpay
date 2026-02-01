import i18n from 'i18n'

const Signatures = {
  sign: (language?: string) => {
    i18n.setLocale(language || 'en')
    return `

<p>
${i18n.__('mail.sign.thanks')}, <br />
${i18n.__('mail.sign.team')}
</p>
----------------------

<p>
https://gitpay.me (Web) <br />
contact@gitpay.me (Email) <br />
Worknenjoy Inc.,
9450 SW Gemini Dr
PMB 72684
Beaverton, Oregon 97008-7105 US (Mail) <br />
</p>
`
  },

  buttons: (language: string, buttons: any) => {
    i18n.setLocale(language || 'en')
    let secondary = ''
    if (buttons.secondary) {
      secondary = `<td style="border-radius: 2px;" bgcolor="#009688">
      <a href="${buttons.secondary.url}" target="_blank" style="padding: 8px 12px;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
          ${i18n.__(buttons.secondary.label)}             
      </a>
  </td>`
    }
    return `

<table style="margin-top: 20px" width="100%" cellspacing="0" cellpadding="0">
  <tr>
      <td>
          <table cellspacing="20" cellpadding="0">
              <tr>
                  <td style="border-radius: 2px;" bgcolor="#009688">
                      <a href="${buttons.primary.url}" target="_blank" style="padding: 8px 12px; border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                          ${i18n.__(buttons.primary.label)}             
                      </a>
                  </td>
                  ${secondary}
              </tr>
          </table>
      </td>
  </tr>
</table>
`
  },

  header: () => {
    return `
    <table width="100%" align="center" height="215" style="background: url('https://alexandremagno.net/wp-content/uploads/2019/05/bg-mail-top.png') no-repeat center; background-size: contain;">
    <tr>
        <td align="center">
            <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center">
                        <a href="https://gitpay.me" target="_blank">
                            <img width="200" src="https://alexandremagno.net/wp-content/uploads/2018/09/logo-transparent.png" />
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  </table>`
  }
}

export default Signatures

module.exports = Signatures
