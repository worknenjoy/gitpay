import React from 'react'
import LinkField from './link-field'
import logoBitbucket from 'images/bitbucket-logo.png'

export default {
  title: 'Design Library/Molecules/Tables/Base/LinkField',
  component: LinkField,
}

const Template = (args) => <LinkField {...args} />

export const Default = Template.bind({})
Default.args = {
  url: 'https://example.com/issue/123',
  iconImg: logoBitbucket,
  title: 'Sample Issue',
  tooltipTitle: 'Open issue in external link',
  external: true,
  copiable: true,
}
