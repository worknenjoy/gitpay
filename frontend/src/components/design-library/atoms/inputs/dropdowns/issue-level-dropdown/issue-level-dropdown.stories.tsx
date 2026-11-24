import type { Meta, StoryObj } from '@storybook/react'
import IssueLevelDropdown from './issue-level-dropdown'

const meta: Meta<typeof IssueLevelDropdown> = {
  title: 'Design Library/Atoms/Inputs/Dropdowns/IssueLevelDropdown',
  component: IssueLevelDropdown
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

/** Small text button with a menu — used inside the Solve card's Level row. */
export const Compact: Story = {
  args: { id: 1, level: 'medium', updateTask: () => {}, variant: 'compact' } as any
}
