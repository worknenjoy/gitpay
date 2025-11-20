import React from 'react'
import ProfileMainHeader from './profile-main-header'

export default {
  title: 'Design Library/Molecules/Headers/ProfileHeaders/ProfileMainHeader',
  component: ProfileMainHeader
}

const Template = (args) => <ProfileMainHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Profile Header',
  subtitle: 'This is a subtitle'
}

export const WithStatus = Template.bind({})
WithStatus.args = {
  title: 'Profile Header with Status',
  subtitle: 'This is a subtitle with status',
  aside: <span>Status: Active</span>
}

export const WithPendingStatus = Template.bind({})
WithPendingStatus.args = {
  title: 'Profile Header with Pending Status',
  subtitle: 'This is a subtitle with pending status',
  aside: <span>Status: Pending</span>
}

export const Loading = Template.bind({})
Loading.args = {
  title: 'Loading Profile Header',
  subtitle: 'This is a loading state',
  completed: false
}
