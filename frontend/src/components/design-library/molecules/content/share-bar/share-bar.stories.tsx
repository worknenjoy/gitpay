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
