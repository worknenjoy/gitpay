import type { Meta, StoryObj } from '@storybook/react'
import IssueVisibilityMenu from './issue-visibility-menu'

const meta: Meta<typeof IssueVisibilityMenu> = {
  title: 'Design Library/Molecules/Menus/IssueVisibilityMenu',
  component: IssueVisibilityMenu,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof IssueVisibilityMenu>

export const Public: Story = { args: { value: 'public', onChange: () => {} } }
export const NotListed: Story = { args: { value: 'unlisted', onChange: () => {} } }
export const Open: Story = { args: { value: 'public', onChange: () => {}, defaultOpen: true } }
export const ReadOnly: Story = { args: { value: 'public' } }
