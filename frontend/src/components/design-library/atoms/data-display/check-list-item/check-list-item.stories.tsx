import React from 'react'
import CheckListItem from './check-list-item'

const meta = {
  title: 'Design Library/Atoms/DataDisplay/CheckListItem',
  component: CheckListItem,
  args: {
    label: 'Account created'
  }
}

export default meta

const Template = (args) => <CheckListItem {...args} />

export const Checked = Template.bind({})
Checked.args = { state: 'checked' }

export const Empty = Template.bind({})
Empty.args = { state: 'empty' }

export const Linked = Template.bind({})
Linked.args = {
  state: 'empty',
  label: 'Payout account connected',
  onClick: () => alert('Go complete this step clicked')
}

export const Failed = Template.bind({})
Failed.args = { state: 'failed', label: "You're the author of this Pull Request on GitHub" }

export const Warning = Template.bind({})
Warning.args = { state: 'warning', label: 'The Pull Request needs another review' }

export const Loading = Template.bind({})
Loading.args = { state: 'loading' }
