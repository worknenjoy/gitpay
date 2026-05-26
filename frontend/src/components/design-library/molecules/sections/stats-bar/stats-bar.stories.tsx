import React from 'react'
import StatsBar from './stats-bar'

export default {
  title: 'Design Library/Molecules/Sections/StatsBar',
  component: StatsBar
}

const Template = (args) => <StatsBar {...args} />

export const Default = Template.bind({})
Default.args = {
  getInfo: () => {},
  completed: true,
  totalPaid: 125000,
  workCount: 340,
  users: 5000,
  countries: 42
}

export const Loading = Template.bind({})
Loading.args = {
  getInfo: () => {},
  completed: false,
  totalPaid: 0,
  workCount: 0,
  users: 0,
  countries: 0
}
