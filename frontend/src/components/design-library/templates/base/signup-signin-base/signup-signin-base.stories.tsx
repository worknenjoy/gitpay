import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import SignupSigninBase from './signup-signin-base'

const meta: Meta<typeof SignupSigninBase> = {
  title: 'Design Library/Templates/Base/SignupSigninBase',
  component: SignupSigninBase,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: <div>Default Content</div>,
  },
}
export default meta

type Story = StoryObj<typeof SignupSigninBase>

export const Default: Story = {
  args: {},
}
