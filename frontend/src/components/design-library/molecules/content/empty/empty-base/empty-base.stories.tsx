import React from 'react'
import EmptyBase from './empty-base'
import { AccessAlarm as AlarmIcon } from '@mui/icons-material' // you can replace this icon

export default {
  title: 'Design Library/Molecules/Empty/EmptyBase',
  component: EmptyBase
}

const Template = (args) => <EmptyBase {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Custom = Template.bind({})
Custom.args = {
  text: 'Nothing here yet',
  actionText: 'Get Started',
  onActionClick: () => alert('Get Started clicked!'),
  icon: <AlarmIcon style={{ fontSize: 60, color: 'gray' }} />
}
