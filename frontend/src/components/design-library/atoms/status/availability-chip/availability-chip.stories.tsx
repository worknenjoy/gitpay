import type { Meta, StoryObj } from '@storybook/react'
import AvailabilityChip from './availability-chip'

const meta: Meta<typeof AvailabilityChip> = {
  title: 'Design Library/Atoms/Status/AvailabilityChip',
  component: AvailabilityChip,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof AvailabilityChip>

export const Available: Story = {
  args: { label: 'Open for job opportunities', active: true }
}

export const Unavailable: Story = {
  args: { label: 'Not currently available', active: false }
}
