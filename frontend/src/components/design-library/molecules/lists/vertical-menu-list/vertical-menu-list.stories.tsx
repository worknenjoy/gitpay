import type { Meta, StoryObj } from '@storybook/react'
import VerticalMenulList from './vertical-menu-list'

const meta: Meta<typeof VerticalMenulList> = {
  title: 'Design Library/Molecules/Lists/VerticalMenuList',
  component: VerticalMenulList,
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof VerticalMenulList>

export const Default: Story = {
  args: {
    title: 'Menu',
    items: [
      { label: 'Dashboard', onClick: () => alert('Dashboard clicked') },
      { label: 'Settings', onClick: () => alert('Settings clicked') },
      { label: 'Logout', onClick: () => alert('Logout clicked') },
    ],
  },
}
