import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import ActionButtons from './action-buttons'
import { Dialog } from '@mui/material'

export default {
  title: 'Design Library/Atoms/Buttons/ActionButtons',
  component: ActionButtons,
}

const Template = (args) => <ActionButtons {...args} />

export const Default = Template.bind({})
Default.args = {
  primary: [
    {
      key: 'create',
      onClick: () => {},
      label: 'Create',
      disabled: false,
      icon: <AddIcon fontSize="small" />,
      component: <Dialog open={false}>create</Dialog>,
    },
  ],
  secondary: [
    {
      key: 'cancel',
      onClick: () => {},
      label: 'Cancel',
      disabled: false,
      icon: <CancelIcon fontSize="small" />,
      component: <Dialog open={false}>cancel</Dialog>,
    },
  ],
}

export const WithManyActions = Template.bind({})
WithManyActions.args = {
  primary: [
    {
      key: 'create 2',
      onClick: () => {},
      label: 'Create',
      disabled: false,
      icon: <AddIcon fontSize="small" />,
      component: <Dialog open={false}>create 2</Dialog>,
    },
    {
      key: 'edit',
      onClick: () => {},
      label: 'Edit',
      disabled: false,
      icon: <EditIcon fontSize="small" />,
      component: <Dialog open={false}>edit</Dialog>,
    },
    {
      key: 'delete',
      onClick: () => {},
      label: 'Delete',
      disabled: false,
      icon: <DeleteIcon fontSize="small" />,
      component: <Dialog open={false}>delete</Dialog>,
    },
  ],
  secondary: [
    {
      key: 'cancel secondary',
      onClick: () => {},
      label: 'Cancel',
      disabled: false,
      icon: <CancelIcon fontSize="small" />,
      component: <Dialog open={false}>cancel secondary</Dialog>,
    },
    {
      key: 'save secondary',
      onClick: () => {},
      label: 'Save',
      disabled: false,
      icon: <SaveIcon fontSize="small" />,
      component: <Dialog open={false}>save secondary</Dialog>,
    },
  ],
}
