import React from 'react'
import { FormattedMessage } from 'react-intl'
import BaseTerms from '../base-terms/base-terms'

const CookiePolicy = ({ extraStyles = true }) => {
  const content = `
  {br}
  Introduction
  {br}
Welcome to Gitpay! This Cookie Policy explains how we use cookies, similar tracking technologies, and your choices regarding such technologies when you visit our website.
{br}
{br}
What are cookies?
Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They enable the website to remember your actions and preferences (such as login details, language, font size, and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
{br}
{br}
Types of cookies we use
We use the following types of cookies on Gitpay:
{br}
{br}
a) Essential cookies:
These cookies are necessary for the operation of our website and enable you to navigate the site and use its features. Without these cookies, certain functionalities may be unavailable.
{br}
{br}
b) Analytical cookies:
Analytical cookies help us understand how visitors interact with our website by collecting information anonymously. This data helps us analyze and improve the performance and usability of our website.
{br}
{br}
c) Functional cookies:
Functional cookies allow us to remember your preferences and provide enhanced functionality and personalization. These cookies may be set by us or by third-party providers whose services we have added to our pages.
{br}
{br}
d) Advertising cookies:
Advertising cookies are used to deliver relevant advertisements to you. They track your browsing habits and help us display personalized ads based on your interests. These cookies may be set by us or by third-party advertising networks.
{br}{br}

Third-party cookies
We may also use cookies from third-party services, such as Google Analytics, to track and analyze website usage. These third-party cookies are subject to the respective third parties' privacy policies.
{br}{br}
Cookie management{br}
You can manage and control cookies in various ways. You can set your browser to refuse all or some cookies, or to alert you when websites set or access cookies. Please note that if you disable or refuse cookies, some parts of our website may become inaccessible or not function properly.
{br}{br}
To manage your cookie preferences, you can modify the settings in your browser. Each browser has different procedures for managing cookies, so please refer to the instructions provided by your browser.
{br}{br}
Updates to this Cookie Policy{br}
We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will post any revised version on this page with an updated effective date.
{br}{br}
Contact us
{br}{br}
If you have any questions or concerns about this Cookie Policy or our use of cookies on Gitpay, please contact us at contact@gitpay.me.
{br}
Please note that this Cookie Policy should be read in conjunction with our Privacy Policy, which provides further information on how we collect, use, and disclose your personal data.
  `

  return (
    <>
      <BaseTerms
        title={<FormattedMessage id="cookie.policy.title" defaultMessage="Cookie Policy" />}
        subtitle={
          <FormattedMessage
            id="cookie.policy.subtitle.secondary"
            defaultMessage="About our Cookie Policy"
          />
        }
        updated={
          <FormattedMessage id="cookie.policy.updated" defaultMessage="Updated 5 May, 2023" />
        }
        content={
          <FormattedMessage
            id="cookie.policy.content"
            defaultMessage={content}
            values={{ br: <br /> }}
          />
        }
        extraStyles={extraStyles}
      />
    </>
  )
}

export default CookiePolicy
