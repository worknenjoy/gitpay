import React from 'react'
import { AcUnit as AcUnitIcon } from '@mui/icons-material'

import ActionsMenu from './actions-menu'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design Library/Molecules/Menus/ActionsMenu',
  component: ActionsMenu
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //argTypes: {
  //  tags: { control: '' },
  //},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ActionsMenu {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  actions: [
    {
      children: 'Action 1',
      onClick: () => {}
    },
    {
      children: 'Action 2',
      onClick: () => {}
    }
  ]
}

export const ConfirmButton = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ConfirmButton.args = {
  actions: [
    {
      children: 'Delete Item',
      onClick: () => {
        console.log('Item deleted')
      },
      confirm: {
        dialogMessage: 'Are you sure you want to delete this item?',
        alertMessage: 'Item has been deleted.'
      }
    },
    {
      children: 'Action 2',
      onClick: () => {}
    }
  ]
}

export const customIcons = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
customIcons.args = {
  actions: [
    {
      children: 'View',
      onClick: () => {},
      icon: <AcUnitIcon fontSize="small" />
    },
    {
      children: 'Action 2',
      onClick: () => {}
    }
  ]
}
