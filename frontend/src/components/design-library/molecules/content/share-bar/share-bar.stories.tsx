import type { Meta, StoryObj } from '@storybook/react'
import ShareBar from './share-bar'

const meta: Meta<typeof ShareBar> = {
  title: 'Design Library/Molecules/Content/ShareBar',
  component: ShareBar,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof ShareBar>

export const Default: Story = {
  args: {
    url: 'https://gitpay.me/alexandremagno'
  }
}

const follow = {
  following: false,
  count: 24,
  onToggle: () => {},
  tooltip: 'Get notified when a bounty is added or a solution is sent.'
}

export const WithFollow: Story = {
  args: {
    url: 'https://gitpay.me/task/3094',
    copyTitle: 'Copy issue link',
    follow
  }
}

export const Following: Story = {
  args: {
    ...WithFollow.args,
    follow: { ...follow, following: true, count: 25 }
  }
}
