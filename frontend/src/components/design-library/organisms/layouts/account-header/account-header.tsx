import React, { useState } from 'react';
import ImportIssueButton from '../../../organisms/layouts/topbar/import-issue';
import ImportIssueDialog from '../../../organisms/layouts/topbar/import-issue-dialog';
import ProfileAccountMenu from '../../../molecules/menus/profile-account-menu/profile-account-menu';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    backgroundColor: '#fff',
    padding: '10px 20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 0'
    }
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }

  },
  actionButtons: {
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      width: '100%'
    }
  },
  account: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      width: '100%',
      justifyContent: 'center',
    }
  }
}));

const AccountHeader = ({
  user,
  onCreateTask,
  onLogout
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [openAddIssue, setOpenAddIssue] = useState(false);

  const handleAddIssueClick = () => {
    setOpenAddIssue(true)
  }

  const onHandleCreateTask = (props: any, history: any) => {
    onCreateTask(props, history)
    setOpenAddIssue(false)
  }

  return (
    <div className={classes.container}>
      <Grid xs={12} md={4}></Grid>
      <Grid xs={12} md={8} className={classes.wrapper}>
        <div className={classes.inner}>
          {user?.Types?.map((t: any) => t.name).includes('contributor') &&
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
          {(user?.Types?.map((t: any) => t.name).includes('maintainer') || user?.Types?.map((t: any) => t.name).includes('funding')) &&
            <>
              <ImportIssueButton
                onAddIssueClick={ handleAddIssueClick }
                classes={classes}
              />
              <ImportIssueDialog
                open={ openAddIssue }
                onClose={ () => setOpenAddIssue(false) }
                onCreate={ (props: any) => onHandleCreateTask(props, history) }
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

export default AccountHeader