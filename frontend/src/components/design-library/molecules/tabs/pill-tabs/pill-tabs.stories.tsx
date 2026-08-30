import React from 'react'
import PillTabs from './pill-tabs'

export default {
  title: 'Design Library/Molecules/Tabs/PillTabs',
  component: PillTabs
}

const Template = (args) => <PillTabs {...args} />

export const Default = Template.bind({})
Default.args = {
  activeTab: 'services',
  tabs: [
    { value: 'services', label: 'Services' },
    { value: 'bounties', label: 'Bounties' }
  ],
  children: <div>Tab content</div>
}

export const FiveWay = Template.bind({})
FiveWay.args = {
  activeTab: 'overview',
  tabs: [
    { value: 'overview', label: 'Overview' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'maintainer', label: 'Maintainer' },
    { value: 'provider', label: 'Service provider' },
    { value: 'funding', label: 'Funding' }
  ],
  children: <div>Tab content</div>
}
