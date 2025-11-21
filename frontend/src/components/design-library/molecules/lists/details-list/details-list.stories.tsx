import type { Meta, StoryObj } from '@storybook/react'
import DetailsList from './details-list'

const meta: Meta<typeof DetailsList> = {
  title: 'Design Library/Molecules/Lists/DetailsList',
  component: DetailsList,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof DetailsList>

export const Default: Story = {
  args: {
    completed: true,
    details: [
      { label: 'Name', value: 'John Doe' },
      { label: 'Email', value: 'john.doe@example.com' },
      { label: 'Role', value: 'Developer' },
      { label: 'Department', value: 'Engineering' }
    ]
  }
}

export const WithChips: Story = {
  args: {
    completed: true,
    details: [
      { label: 'Name', value: 'Jane Smith' },
      { label: 'Email', value: 'jane.smith@example.com' },
      { label: 'Role', value: 'Designer', valueType: 'chip' },
      { label: 'Department', value: 'Creative' }
    ]
  }
}

export const Loading: Story = {
  args: {
    details: [],
    completed: false
  }
}

export const Empty: Story = {
  args: {
    details: [],
    completed: true
  }
}
