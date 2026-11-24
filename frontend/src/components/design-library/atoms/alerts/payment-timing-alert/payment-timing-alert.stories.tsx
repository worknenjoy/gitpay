import type { Meta, StoryObj } from '@storybook/react'
import PaymentTimingAlert from './payment-timing-alert'

const meta: Meta<typeof PaymentTimingAlert> = {
  title: 'Design Library/Atoms/Alerts/PaymentTimingAlert',
  component: PaymentTimingAlert,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof PaymentTimingAlert>

export const PaidInAdvance: Story = { args: { timing: 'advance' } }
export const PayLater: Story = { args: { timing: 'later' } }
export const Flexible: Story = {
  args: {
    timing: 'flex',
    description:
      '$200 paid in advance, $150 pledged. Sponsors can pay now or when a solution is accepted.'
  }
}
export const WithSwitch: Story = { args: { timing: 'advance', onSwitch: () => {} } }
export const LaterWithSwitch: Story = { args: { timing: 'later', onSwitch: () => {} } }
