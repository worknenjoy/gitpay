import type { Meta, StoryObj } from '@storybook/react'
import ActionsField from './action-field'

// Adjust this import if the component is not the default export or the path differs.

const meta: Meta<typeof ActionsField> = {
  title: 'Design Library/Molecules/Tables/Base/ActionsField',
  component: ActionsField as any,
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Update prop names/shapes as needed to match ActionsMenu API
    actions: [
      {
        children: 'View',
        onClick: () => alert('View action clicked'),
        icon: null,
      },
      {
        children: 'Edit',
        onClick: () => alert('Edit action clicked'),
        icon: null,
      },
    ],
  } as any,
}
