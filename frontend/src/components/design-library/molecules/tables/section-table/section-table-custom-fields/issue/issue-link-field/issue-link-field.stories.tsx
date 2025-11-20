import React from 'react'
import IssueLinkField from './issue-link-field'

export default {
  title: 'Design Library/Molecules/Tables/Fields/Issue/IssueLinkField',
  component: IssueLinkField,
}

const Template = (args) => <IssueLinkField {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  issue: {
    title: 'Issue title',
    id: 1,
    url: 'https://github.com',
    provider: 'github',
  },
}
