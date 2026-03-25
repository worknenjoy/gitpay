import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import PaymentRequestInstructionsHero from './payment-request-instructions-hero'

const meta: Meta<typeof PaymentRequestInstructionsHero> = {
  title: 'Design Library/Molecules/Heroes/PaymentRequestInstructionsHero',
  component: PaymentRequestInstructionsHero,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta

type Story = StoryObj<typeof PaymentRequestInstructionsHero>

export const Default: Story = {}

export const Contrast: Story = {
  args: {
    contrast: true
  }
}
