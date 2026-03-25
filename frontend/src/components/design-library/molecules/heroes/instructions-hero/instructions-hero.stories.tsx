import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import InstructionsHero from './instructions-hero'

import paymentIcon from 'images/payment-icon.png'
import sharingImage from 'images/sharing.png'
import payoutImage from 'images/gitpay-app.png'

const meta: Meta<typeof InstructionsHero> = {
  title: 'Design Library/Molecules/Heroes/InstructionsHero',
  component: InstructionsHero,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

type Story = StoryObj<typeof InstructionsHero>

export const PaymentRequestFlow: Story = {
  args: {
    title: 'Payment request',
    description: 'Create a link, share it, and receive payouts in your local currency.',
    steps: [
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
      },
      {
        title: 'Receive payment',
        description: 'Get paid by your client through the payment link, with secure transactions and real-time updates.',
        screenshotSrc: paymentIcon,
        screenshotAlt: 'Receiving payment'
      }
    ]
  }
}

export const Contrast: Story = {
  args: {
    contrast: true,
    title: 'Payment request',
    description: 'Same flow with the alternative hero background.',
    steps: [
      {
        title: 'Create payment link',
        screenshotSrc: paymentIcon
      },
      {
        title: 'Share',
        screenshotSrc: sharingImage
      },
      {
        title: 'Payout to your bank account in your local currency',
        screenshotSrc: payoutImage
      }
    ]
  }
}
