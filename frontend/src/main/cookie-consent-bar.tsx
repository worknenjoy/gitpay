import React from "react";
import CookieConsent from "react-cookie-consent";
import { FormattedMessage } from 'react-intl';


export const GITPAY_COOKIE_CONSENT = 'gitpay-cookie-policy-consent-v1'

const CookieConsentBar = () => (
  <CookieConsent
    location="bottom"
    buttonText="I understand"
    declineButtonText="Decline"
    cookieName={GITPAY_COOKIE_CONSENT}
    style={{ background: "#2B373B", fontFamily: "Inter" }}
    buttonStyle={{ borderRadius: 18 }}
    declineButtonStyle={{ borderRadius: 18 }}
    expires={150}
    enableDeclineButton
  >
    <FormattedMessage id='cookie.message' defaultMessage='We use cookies on our website to provide you with the best possible experience and to help improve our services.' />
    <br />
    <span style={{ fontSize: "10px" }}>
      <FormattedMessage id='cookie.more' defaultMessage='By clicking “I understand” or continuing to browse, you agree to our use of cookies.' />
    </span>
  </CookieConsent>
);

export default CookieConsentBar;