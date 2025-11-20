import React from 'react'
import StatusCard from './status-card'

const meta = {
  title: 'Design Library/Molecules/Cards/StatusCard',
  component: StatusCard,
  args: {
    status: 'Done',
    name: 'Available Balance',
    completed: true,
  },
}

export default meta

const Template = (args) => <StatusCard {...args} />

export const Default = Template.bind({})
Default.args = {
  status: 'Done',
  name: 'Available Balance',
  completed: true,
}

export const Loading = Template.bind({})
Loading.args = {
  completed: false,
}
