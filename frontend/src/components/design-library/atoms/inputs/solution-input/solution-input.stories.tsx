import type { Meta, StoryObj } from '@storybook/react'
import SolutionInput from './solution-input'

const meta: Meta<typeof SolutionInput> = {
  title: 'Design Library/Atoms/Inputs/SolutionInput',
  component: SolutionInput,
  args: {},
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof SolutionInput>

export const Default: Story = {
  args: {},
}
