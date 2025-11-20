import React from 'react'
import { AvatarPlaceholder } from './avatar-placeholder'

export default {
  title: 'Design Library/Atoms/Loaders/Placeholders/AvatarPlaceholder',
  component: AvatarPlaceholder,
}

const Template = (args) => <AvatarPlaceholder {...args} />

export const Default = Template.bind({})
Default.args = {
  src: 'https://via.placeholder.com/150',
  alt: 'Default Avatar',
}
