import React from 'react'
import ListCardRow from './list-card-row'

const meta = {
  title: 'Design Library/Molecules/Cards/ListCard/ListCardRow',
  component: ListCardRow,
  args: {
    meta: ['worknenjoy/gitpay', '#1284', 'assigned 4 days ago'],
    title: 'Payment request expiry is ignored when the link is reopened'
  }
}

export default meta

const Template = (args) => <ListCardRow {...args} />

export const Bare = Template.bind({})
Bare.args = {}

export const WithChip = Template.bind({})
WithChip.args = {
  chip: { label: 'Open', tone: 'success' }
}

export const WithAmount = Template.bind({})
WithAmount.args = {
  chip: { label: 'Closed', tone: 'error' },
  currency: '$',
  amount: '180.00'
}

export const WithWhen = Template.bind({})
WithWhen.args = {
  chip: { label: 'Merged', tone: 'success' },
  currency: '$',
  amount: '120.00',
  when: 'Paid'
}

export const Clickable = Template.bind({})
Clickable.args = {
  chip: { label: 'Open', tone: 'success' },
  currency: '$',
  amount: '240.00',
  onClick: () => alert('Row clicked')
}

export const WithLeadingAndExtra = Template.bind({})
WithLeadingAndExtra.args = {
  meta: ['Card', 'Nov 10'],
  title: 'worknenjoy',
  leading: (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#407E6F',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12
      }}
    >
      W
    </span>
  ),
  extra: <span style={{ fontSize: 12, color: '#6e6e6e' }}>64 paid · $9,840 total</span>,
  chip: { label: 'Paid · held', tone: 'success' },
  currency: '$',
  amount: '200.00'
}
