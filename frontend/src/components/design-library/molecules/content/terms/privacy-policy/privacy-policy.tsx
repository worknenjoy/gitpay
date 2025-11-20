import React from 'react'
import { FormattedMessage } from 'react-intl'
import BaseTerms from '../base-terms/base-terms'

type PrivacyPolicyProps = {
  onArrowBack?: () => void
  onAgreeTerms?: () => void
  noHeader?: boolean
  extraStyles?: boolean
}

const PrivacyPolicy = ({
  onArrowBack,
  onAgreeTerms,
  noHeader,
  extraStyles = true
}: PrivacyPolicyProps) => {
  const content = `
  {br}
  Thank you for considering our bounty platform! Our platform takes your privacy very seriously, and we are committed to protecting your personal information. This privacy policy outlines how we collect, use, and protect your personal information when you use our platform.
{br}
{br}
1. Information We Collect:
When you create an account on our platform, we collect personal information such as your name, email address, and payment information. We also collect information about the projects you participate in and the bounties you earn.
{br}{br}
2. Use of Information:
We use the personal information we collect to facilitate payments and communications between contributors, maintainers, and sponsors. We also use this information to improve our platform and to comply with legal obligations.
{br}{br}
3. Sharing of Information:
We do not sell or rent your personal information to third parties. However, we may share your information with service providers who assist us in operating our platform or who help us process payments. We may also share your information if required by law or if necessary to protect our rights or the rights of others.
{br}{br}
4. Data Security:
We take reasonable measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee the absolute security of your personal information.
{br}{br}
5. Retention of Information:
We will retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
{br}{br}
6. Your Rights:
You have the right to access, modify, or delete your personal information at any time by logging into your account on our platform. You also have the right to object to or restrict the processing of your personal information, and to receive a copy of your personal information in a structured, machine-readable format.
{br}{br}
7. Children's Privacy:
Our platform is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we become aware that we have collected personal information from a child under the age of 13, we will take steps to delete the information as soon as possible.
{br}{br}
8. Changes to this Policy:
We reserve the right to modify this privacy policy at any time. If we make material changes to this policy, we will notify you by email or by posting a notice on our platform.
{br}{br}
If you have any questions or concerns about our privacy policy, please contact us at contact@gitpay.me`

  return (
    <>
      <BaseTerms
        title={<FormattedMessage id="privacy-policy.title" defaultMessage="Privacy Policy" />}
        subtitle={
          <FormattedMessage
            id="privacy-policy.subtitle.secondary"
            defaultMessage="About our privacy policy"
          />
        }
        updated={<FormattedMessage id="privacy-policy.date" defaultMessage="Updated 5 May, 2023" />}
        content={
          <FormattedMessage
            id="privacy-policy.content"
            defaultMessage={content}
            values={{ br: <br /> }}
          />
        }
        extraStyles={extraStyles}
        onArrowBack={onArrowBack}
        onAgreeTerms={onAgreeTerms}
        noHeader={noHeader}
      />
    </>
  )
}

export default PrivacyPolicy
