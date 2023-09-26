import React, { useState } from 'react';
import ImportIssueButton from '../../topbar/import-issue';
import ImportIssueDialog from '../../topbar/import-issue-dialog';
import AccountMenu from './account-menu';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';


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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          
        } }>
          {user?.Types?.map(t => t.name).includes('contributor') &&
            <Grid container direction='column' alignItems='center'>
              <Grid item xs={ 12 }>
                <Button
                  onClick={ () => history.push('/profile/tasks/all') }
                  color="primary"
                  variant="outlined"
                  style={{ whiteSpace: 'nowrap', marginRight: 10 }}

                >
                  <FormattedMessage id="profile.tasks.all" defaultMessage='Work on an issue' />
                </Button>
              </Grid>
            </Grid>
          }
          {user?.Types?.map(t => t.name).includes('maintainer') &&
            <>
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
            </>
          }
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