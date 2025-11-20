import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TaskDeadlineForm from './task-deadline-form'

const meta: Meta<any> = {
  title: 'Design Library/Organisms/Forms/DateForms/TaskDeadlineForm',
  component: TaskDeadlineForm,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Story />
      </div>
    )
  ]
}
export default meta

type Story = StoryObj<any>

export const Default: Story = {
  render: (args) => (
    <TaskDeadlineForm
      {...args}
      open={true}
      onHandleClearDeadline={action('onHandleClearDeadline')}
      onHandleDeadline={action('onHandleDeadline')}
    />
  )
}
