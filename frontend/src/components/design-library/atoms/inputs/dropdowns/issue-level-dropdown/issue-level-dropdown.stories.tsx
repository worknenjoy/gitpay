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
