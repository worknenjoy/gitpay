import React, { useState } from 'react'
import CookieConsent from 'react-cookie-consent'
import { FormattedMessage } from 'react-intl'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import CookiePolicy from '../components/areas/private/components/session/cookie-policy'

export const GITPAY_COOKIE_CONSENT = 'gitpay-cookie-policy-consent-v1'

const CookieConsentBar = () => {
  const [openCookiePolicy, setOpenCookiePolicy] = useState(false)

  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      declineButtonText="Decline"
      cookieName={GITPAY_COOKIE_CONSENT}
      style={{ background: '#2B373B', fontFamily: 'Inter' }}
      buttonStyle={{ borderRadius: 18 }}
      declineButtonStyle={{ borderRadius: 18 }}
      expires={150}
      enableDeclineButton
    >
      <FormattedMessage
        id="cookie.message"
        defaultMessage="We use cookies on our website to provide you with the best possible experience and to help improve our services."
      />
      <br />
      <span style={{ fontSize: '10px' }}>
        <FormattedMessage
          id="cookie.more"
          defaultMessage="By clicking “I understand” or continuing to browse, you agree to our use of cookies and our {cookiepolicy}."
          values={{
            cookiepolicy: (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setOpenCookiePolicy(true)
                }}
                style={{ color: '#fff' }}
              >
                <FormattedMessage id="cookie.policy" defaultMessage="Cookie Policy" />
              </a>
            )
          }}
        />
      </span>
      <Dialog open={openCookiePolicy} onClose={() => setOpenCookiePolicy(false)}>
        <DialogContent>
          <CookiePolicy extraStyles={false} />
        </DialogContent>
      </Dialog>
    </CookieConsent>
  )
}

export default CookieConsentBar
