import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'
import PullRequestIcon from '../../icons/pull-request-icon/pull-request-icon'
import SplitButton from './split-button'

const meta: Meta<typeof SplitButton> = {
  title: 'Design Library/Atoms/Buttons/SplitButton',
  component: SplitButton,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof SplitButton>

const importActions = [
  {
    key: 'issue',
    label: 'Import issue',
    description: 'Add a bounty to an issue',
    icon: <BugReportOutlinedIcon fontSize="small" />,
    onClick: () => {}
  },
  {
    key: 'pr',
    label: 'Import pull request',
    description: 'Get paid for a PR you authored',
    icon: <PullRequestIcon fontSize="small" />,
    onClick: () => {}
  }
]

export const Default: Story = {
  args: {
    label: 'Import',
    actions: importActions
  }
}

export const WithDefaultAction: Story = {
  args: {
    label: 'Import issue',
    onDefaultClick: () => {},
    actions: importActions
  }
}

export const Loading: Story = {
  args: {
    label: 'Import',
    actions: importActions,
    completed: false
  }
}

export const Disabled: Story = {
  args: {
    label: 'Import',
    actions: importActions,
    disabled: true
  }
}
