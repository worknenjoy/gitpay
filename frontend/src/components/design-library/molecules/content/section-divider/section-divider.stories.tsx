import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SectionDivider from './section-divider'

const meta: Meta<typeof SectionDivider> = {
  title: 'Design Library/Molecules/Content/SectionDivider',
  component: SectionDivider,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof SectionDivider>

export const Default: Story = {
  args: {
    label: 'Payment links'
  }
}
