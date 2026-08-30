import React from 'react'
import RolePill from './role-pill'

export default {
  title: 'Design Library/Atoms/Badges/RolePill',
  component: RolePill
}

const Template = (args) => <RolePill {...args} />

export const Contributor = Template.bind({})
Contributor.args = { name: 'contributor', active: true, tone: 'orange' }

export const Maintainer = Template.bind({})
Maintainer.args = { name: 'maintainer', active: true, tone: 'teal' }

export const ServiceProvider = Template.bind({})
ServiceProvider.args = { name: 'service provider', active: true, tone: 'yellow' }

export const Funding = Template.bind({})
Funding.args = { name: 'funding', active: true, tone: 'pink' }

export const Inactive = Template.bind({})
Inactive.args = { name: 'contributor', active: false, tone: 'orange' }
