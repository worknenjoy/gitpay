import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import githubLogo from 'images/github-logo-black.png'
import DialogTitle from './dialog-title'

const meta: Meta<typeof DialogTitle> = {
  title: 'Design Library/Molecules/Dialogs/DialogTitle',
  component: DialogTitle,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof DialogTitle>

export const TitleOnly: Story = {
  args: {
    title: 'Insert a new task'
  }
}

export const WithIcon: Story = {
  args: {
    icon: <img src={githubLogo} alt="" width={20} height={20} />,
    title: 'Import Pull Request'
  }
}

export const WithCloseButton: Story = {
  args: {
    icon: <img src={githubLogo} alt="" width={20} height={20} />,
    title: 'Import Pull Request',
    onClose: () => {}
  }
}
