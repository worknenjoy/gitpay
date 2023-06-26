import React, { useState } from 'react';
import ImportIssueButton from '../../topbar/import-issue';
import ImportIssueDialog from '../../topbar/import-issue-dialog';
import AccountMenu from './account-menu';


export default function AccountHeader({
  user,
  history,
  onCreateTask,
  onLogout
}) {

  const [openAddIssue, setOpenAddIssue] = useState(false);

  const handleAddIssueClick = () => {
    setOpenAddIssue(true)
  }

  const onHandleCreateTask = (props, history) => {
    onCreateTask(props, history)
    setOpenAddIssue(false)
  }

  return (
    <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 20 } }>
      <div></div>
      <div style={ {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      } }>
        <div style={ {
          marginRight: 10,
          paddingRight: 15,
          borderRight: '1px solid #ccc',
        } }>
          <ImportIssueButton
            onAddIssueClick={ handleAddIssueClick }
          />
          <ImportIssueDialog
            open={ openAddIssue }
            onClose={ () => setOpenAddIssue(false) }
            onCreate={ (props, history) => onHandleCreateTask(props, history) }
            user={ user }
            history={ history }
          />
        </div>
        <div>
          <AccountMenu 
            user={ user } 
            history={ history }
            onLogout={ onLogout }
          />
        </div>
      </div>
    </div>
  )
}