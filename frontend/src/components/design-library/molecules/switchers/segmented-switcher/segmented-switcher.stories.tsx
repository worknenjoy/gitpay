import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import SegmentedSwitcher from './segmented-switcher'

const meta: Meta<typeof SegmentedSwitcher> = {
  title: 'Design Library/Molecules/Switchers/SegmentedSwitcher',
  component: SegmentedSwitcher,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof SegmentedSwitcher>

const TwoOptionsRender = () => {
  const [value, setValue] = React.useState('services')
  return (
    <SegmentedSwitcher
      value={value}
      onChange={setValue}
      options={[
        { value: 'services', label: 'Services' },
        { value: 'bounties', label: 'Bounties' }
      ]}
    />
  )
}

export const TwoOptions: Story = {
  render: () => <TwoOptionsRender />
}

const ThreeOptionsRender = () => {
  const [value, setValue] = React.useState('open')
  return (
    <SegmentedSwitcher
      value={value}
      onChange={setValue}
      options={[
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
        { value: 'all', label: 'All' }
      ]}
    />
  )
}

export const ThreeOptions: Story = {
  render: () => <ThreeOptionsRender />
}

const TransparentVariantRender = () => {
  const [value, setValue] = React.useState('overview')
  return (
    <SegmentedSwitcher
      variant="transparent"
      value={value}
      onChange={setValue}
      options={[
        { value: 'overview', label: 'Overview' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'maintainer', label: 'Maintainer' },
        { value: 'provider', label: 'Service provider' },
        { value: 'funding', label: 'Funding' }
      ]}
    />
  )
}

export const TransparentVariant: Story = {
  render: () => <TransparentVariantRender />
}
