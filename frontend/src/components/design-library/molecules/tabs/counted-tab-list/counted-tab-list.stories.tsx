import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import CountedTabList from './counted-tab-list'

const meta: Meta<typeof CountedTabList> = {
  title: 'Design Library/Molecules/Tabs/CountedTabList',
  component: CountedTabList,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof CountedTabList>

const DefaultRender = () => {
  const [value, setValue] = React.useState('solved')
  return (
    <CountedTabList
      value={value}
      onChange={setValue}
      items={[
        { value: 'solved', label: 'Issues solved', count: 127 },
        { value: 'sponsored', label: 'Sponsored', count: 12 },
        { value: 'pull-requests', label: 'Pull requests', count: 142 }
      ]}
    />
  )
}

export const Default: Story = {
  render: () => <DefaultRender />
}
