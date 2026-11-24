import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import NumberedSteps from './numbered-steps'

const meta: Meta<typeof NumberedSteps> = {
  title: 'Design Library/Molecules/Lists/NumberedSteps',
  component: NumberedSteps,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof NumberedSteps>

export const Default: Story = {
  args: {
    steps: [
      <>
        <b>Open a pull request</b> on GitHub that fixes the issue
      </>,
      <>
        <b>Send it here</b> as your solution
      </>,
      <>
        <b>Get paid</b> $350.00 when it's merged
      </>
    ]
  }
}

export const TwoSteps: Story = {
  args: {
    steps: ['Connect your account', 'Add a payout method']
  }
}
