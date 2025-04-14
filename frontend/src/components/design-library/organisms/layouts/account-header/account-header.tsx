import React, { useState } from 'react';
import ImportIssueButton from '../../../organisms/layouts/topbar/import-issue';
import ImportIssueDialog from '../../../organisms/layouts/topbar/import-issue-dialog';
import ProfileAccountMenu from '../../../molecules/menus/profile-account-menu/profile-account-menu';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import { Grid, makeStyles, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    backgroundColor: '#fff',
    padding: '10px 20px',
    shadow: '0 0 10px rgba(0,0,0,0.1)',
    '@media (max-width: 37.5em)': {
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 0'
    }
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '@media (max-width: 37.5em)': {
      borderRight: 'none',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20
    }
  },
  inner: {
    marginRight: 10,
    paddingRight: 15,
    borderRight: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '@media (max-width: 37.5em)': {
      borderRight: 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }

  },
  actionButtons: {
    marginRight: 10,
    '@media (max-width: 37.5em)': {
      marginTop: 20,
      width: '100%'
    }
  },
  account: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '@media (max-width: 37.5em)': {
      marginTop: 20,
      width: '100%',
      justifyContent: 'center',
    }
  }
}))

const AccountHeader = ({
  user,
  onCreateTask,
  onLogout
}) => {
  const classes = styles();
  const history = useHistory();

  const [openAddIssue, setOpenAddIssue] = useState(false);

  const handleAddIssueClick = () => {
    setOpenAddIssue(true)
  }

  const onHandleCreateTask = (props, history) => {
    onCreateTask(props, history)
    setOpenAddIssue(false)
  }

  return (
    <div className={classes.container}>
      <Grid xs={12} md={4}></Grid>
      <Grid xs={12} md={8} className={classes.wrapper}>
        <div className={classes.inner}>
          {user?.Types?.map(t => t.name).includes('contributor') &&
            <Grid container direction='column' alignItems='center'>
              <Grid item xs={ 12 }>
                <Button
                  onClick={ () => history.push('/profile/explore') }
                  color="primary"
                  variant="outlined"
                  className={ classes.actionButtons }
                >
                  <FormattedMessage id="profile.header.action.secondary" defaultMessage='Work on an issue' />
                </Button>
              </Grid>
            </Grid>
          }
          {(user?.Types?.map(t => t.name).includes('maintainer') || user?.Types?.map(t => t.name).includes('funding')) &&
            <>
              <ImportIssueButton
                onAddIssueClick={ handleAddIssueClick }
                classes={classes}
              />
              <ImportIssueDialog
                open={ openAddIssue }
                onClose={ () => setOpenAddIssue(false) }
                onCreate={ props => onHandleCreateTask(props, history) }
                user={ user }
              />
            </>
          }
        </div>
        <div className={classes.account}>
          <ProfileAccountMenu 
            user={ user } 
            onLogout={ onLogout }
          />
        </div>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(AccountHeader)