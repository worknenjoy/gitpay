import type { Meta, StoryObj } from '@storybook/react'
import HelpTooltip from './help-tooltip'

const meta: Meta<typeof HelpTooltip> = {
  title: 'Design Library/Atoms/DataDisplay/HelpTooltip',
  component: HelpTooltip,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof HelpTooltip>

export const Default: Story = {
  args: {
    label: 'Visibility',
    text: 'Public issues appear in Explore and search. Not listed issues are hidden from both, but anyone with the link can still open them.'
  }
}

export const Open: Story = {
  args: { ...Default.args, defaultOpen: true }
}
