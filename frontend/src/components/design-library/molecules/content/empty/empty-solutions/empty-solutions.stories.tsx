import type { Meta, StoryObj } from '@storybook/react'
import EmptySolutions from './empty-solutions'

const meta: Meta<typeof EmptySolutions> = {
  title: 'Design Library/Molecules/Empty/EmptySolutions',
  component: EmptySolutions
}

export default meta
type Story = StoryObj<typeof EmptySolutions>

export const Default: Story = { args: {} }
export const WithAction: Story = { args: { onActionClick: () => {} } }
