import type { Meta, StoryObj } from '@storybook/react'
import ExploreTabs from './explore-tabs'

// Adjust the import above if your component exports differently
// e.g. import ExploreTabs from './explore-tabs';

const meta: Meta<typeof ExploreTabs> = {
  title: 'Design Library/Molecules/Tabs/ExploreTabs',
  component: ExploreTabs,
  args: {},
  parameters: {
    //layout: 'centered',
  }
}
export default meta

type Story = StoryObj<typeof ExploreTabs>

export const Default: Story = {
  args: {
    // Add prop mocks here if the component expects any
  }
}
