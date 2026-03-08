import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@mui/material'

import PreferenceRow, { type PreferenceRowProps } from './preference-row'

const meta: Meta<PreferenceRowProps> = {
  title: 'Design Library/Molecules/Lists/PreferenceRow',
  component: PreferenceRow
}

export default meta

type Story = StoryObj<PreferenceRowProps>

export const Default: Story = {
  args: {
    title: 'Preference title',
    description: 'Optional description explaining this preference.'
  },
  render: (args) => <PreferenceRow {...args} action={<Switch defaultChecked color="primary" />} />
}

export const WithDivider: Story = {
  args: {
    title: 'Another preference',
    description: 'With a divider below.',
    divider: true
  },
  render: (args) => <PreferenceRow {...args} action={<Switch color="primary" />} />
}
