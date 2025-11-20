import type { Meta, StoryObj } from '@storybook/react'
import ContextTitle from './context-title'

const meta: Meta<typeof ContextTitle> = {
  title: 'Design Library/Atoms/Typography/Titles/ContextTitle',
  component: ContextTitle,
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content of the context title',
    },
  },
}

export default meta

type Story = StoryObj<typeof ContextTitle>

export const Default: Story = {
  args: {
    context: {
      completed: true,
      data: {
        name: 'Context Title',
      },
    },
    title: 'Main Title',
  },
}
