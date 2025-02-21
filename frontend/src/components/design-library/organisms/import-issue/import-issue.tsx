import React from 'react';
import ImportIssueButton from '../../atoms/import-issue-button/import-issue-button';
import ImportIssueDialog from '../../molecules/import-issue-dialog/import-issue-dialog';

const ImportIssue = ({ onImport }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <ImportIssueButton 
        onAddIssueClick={() => setOpen(true)}
      />
      <ImportIssueDialog
        open={open} onClose={() => setOpen(false)}
        onImport={onImport}
      />
    </div>
  );
}

export default ImportIssue;