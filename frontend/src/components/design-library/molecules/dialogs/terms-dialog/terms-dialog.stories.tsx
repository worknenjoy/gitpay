import React, { useState } from 'react'
import TermsDialog from './terms-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/TermsDialog',
  component: TermsDialog
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
      <button onClick={handleClickOpen}>Open Terms Dialog</button>
      <TermsDialog {...args} open={open} onClose={handleClose} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  // Add default props here
}
