import type { Meta, StoryObj } from '@storybook/react'
import AddBountyButton from './add-bounty-button'

const meta: Meta<typeof AddBountyButton> = {
  title: 'Design Library/Atoms/Buttons/AddBountyButton',
  component: AddBountyButton,
  parameters: { layout: 'centered' },
  args: { onAdd: () => {} }
}

export default meta
type Story = StoryObj<typeof AddBountyButton>

export const AddBounty: Story = { args: {} }
export const AddToBounty: Story = { args: { hasBounty: true } }
export const WithPayLaterMenu: Story = { args: { hasBounty: true, allowLater: true } }
export const PayLaterDisabled: Story = {
  args: {
    allowLater: true,
    laterDisabledReason: 'This issue requires payment in advance.'
  }
}
export const Disabled: Story = { args: { disabled: true } }
