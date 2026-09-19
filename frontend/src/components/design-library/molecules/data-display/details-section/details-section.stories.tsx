import React from 'react'
import DetailsSection, { DetailsSectionPlaceholder } from './details-section'

const meta = {
  title: 'Design Library/Molecules/DataDisplay/DetailsSection',
  component: DetailsSection
}

export default meta

const Template = (args) => <DetailsSection {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Wallet order info',
  items: [
    { label: 'Status', value: 'Paid' },
    { label: 'Amount', value: '$120.00' },
    { label: 'Invoice number', value: 'INV-2291' },
    { label: 'Created', value: '6 Sep 2026' }
  ]
}

export const WithVariants = Template.bind({})
WithVariants.args = {
  title: 'Breakdown',
  items: [
    { label: 'Customer paid', value: '$120.00' },
    { label: 'Fees', value: '-$3.60', variant: 'negative' },
    { label: 'Net amount', value: '$116.40', variant: 'emphasis' }
  ]
}

export const Empty = Template.bind({})
Empty.args = {
  title: 'Activity',
  items: []
}

export const Loading = () => <DetailsSectionPlaceholder />
