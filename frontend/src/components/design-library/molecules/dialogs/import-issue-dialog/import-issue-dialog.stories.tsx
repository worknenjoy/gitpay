import React, { useState } from 'react'
import ImportIssueDialog from './import-issue-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/ImportIssueDialog',
  component: ImportIssueDialog,
}

const Template = (args) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Import Issue Dialog</button>
      <ImportIssueDialog {...args} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  // Add default args here if needed
  onImport: () => {},
}
