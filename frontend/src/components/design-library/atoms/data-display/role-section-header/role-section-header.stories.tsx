import React from 'react'
import CodeIcon from '@mui/icons-material/Code'
import RoleSectionHeader from './role-section-header'

const meta = {
  title: 'Design Library/Atoms/DataDisplay/RoleSectionHeader',
  component: RoleSectionHeader
}

export default meta

const Template = (args) => <RoleSectionHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  icon: <CodeIcon fontSize="small" />,
  label: 'Contributor',
  sub: '$4,293.20 earned · 2 issues open',
  linkText: 'Open contributor view',
  onLinkClick: () => alert('Open contributor view clicked')
}

export const WithoutLink = Template.bind({})
WithoutLink.args = {
  icon: <CodeIcon fontSize="small" />,
  label: 'Contributor',
  sub: '$4,293.20 earned · 2 issues open'
}
