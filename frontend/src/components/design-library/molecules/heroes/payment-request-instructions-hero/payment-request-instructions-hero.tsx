import React from 'react'

import InstructionsHero from 'design-library/molecules/heroes/instructions-hero/instructions-hero'

import paymentIcon from 'images/payment-icon.png'
import sharingImage from 'images/sharing.png'
import payoutImage from 'images/gitpay-app.png'

type PaymentRequestInstructionsHeroProps = {
  contrast?: boolean
}

const PaymentRequestInstructionsHero = ({ contrast = false }: PaymentRequestInstructionsHeroProps) => {
  return (
    <InstructionsHero
      contrast={contrast}
      title="Payment request"
      description="Create a link, share it, and receive payouts in your local currency."
      steps={[
        {
          title: 'Create payment link',
          description: 'Set amount, description, and generate a shareable payment URL.',
          screenshotSrc: paymentIcon,
          screenshotAlt: 'Payment link creation'
        },
        {
          title: 'Share',
          description: 'Send the payment link to your client via email, chat, or social.',
          screenshotSrc: sharingImage,
          screenshotAlt: 'Sharing the link'
        },
        {
          title: 'Payout to your bank account in your local currency',
          description: 'Withdraw funds to your bank account when you are ready.',
          screenshotSrc: payoutImage,
          screenshotAlt: 'Payout to bank account'
        }
      ]}
    />
  )
}

export default PaymentRequestInstructionsHero
