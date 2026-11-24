import type { Meta, StoryObj } from '@storybook/react'
import IssueShareBar from './issue-share-bar'

const meta: Meta<typeof IssueShareBar> = {
  title: 'Design Library/Molecules/Content/IssueShareBar',
  component: IssueShareBar,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof IssueShareBar>

export const Default: Story = { args: { url: 'https://gitpay.me/task/3094' } }
export const WithFollow: Story = {
  args: { url: 'https://gitpay.me/task/3094', followers: 24, onFollow: () => {} }
}
export const Following: Story = {
  args: { ...WithFollow.args, following: true, followers: 25 }
}
