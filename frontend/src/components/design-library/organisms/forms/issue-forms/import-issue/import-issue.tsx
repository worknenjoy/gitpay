import React from 'react'
import ImportIssueButton from '../../../../atoms/buttons/import-issue-button/import-issue-button'
import ImportIssueDialog from '../../../../molecules/dialogs/import-issue-dialog/import-issue-dialog'

const ImportIssue = ({ onImport }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <ImportIssueButton onAddIssueClick={() => setOpen(true)} />
      <ImportIssueDialog open={open} onClose={() => setOpen(false)} onImport={onImport} />
    </div>
  )
}

export default ImportIssue
