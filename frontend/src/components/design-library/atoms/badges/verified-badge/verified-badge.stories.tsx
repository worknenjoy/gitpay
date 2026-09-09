import type { Meta, StoryObj } from '@storybook/react'
import VerifiedBadge from './verified-badge'

const meta: Meta<typeof VerifiedBadge> = {
  title: 'Design Library/Atoms/Badges/VerifiedBadge',
  component: VerifiedBadge,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof VerifiedBadge>

export const Default: Story = {
  args: { size: 'medium' }
}

export const Small: Story = {
  args: { size: 'small' }
}
