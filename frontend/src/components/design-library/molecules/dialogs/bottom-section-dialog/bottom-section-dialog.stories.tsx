import React from 'react'
import BottomSectionDialog from './bottom-section-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/BottomSectionDialog',
  component: BottomSectionDialog,
}

const Template = (args) => <BottomSectionDialog {...args} />

export const Default = Template.bind({})
Default.args = {
  // Add default props here
  header: 'header section',
  title: 'title',
  subtitle: 'subtitle',
  content: 'content',
}
