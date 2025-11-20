import React from 'react'
import StatsBar from './stats-bar'

export default {
  title: 'Design Library/Molecules/Sections/StatsBar',
  component: StatsBar
}

const Template = (args) => <StatsBar {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  info: () => {},
  tasks: '20',
  bounties: '2000',
  users: '5000'
}
