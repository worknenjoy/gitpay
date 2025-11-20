import React, { useState } from 'react'
import PrivacyDialog from './privacy-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/PrivacyPolicyDialog',
  component: PrivacyDialog,
}

const Template = (args) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <button onClick={handleClickOpen}>Open Privacy Policy Dialog</button>
      <PrivacyDialog {...args} open={open} onClose={handleClose} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  // Add default props here
}
