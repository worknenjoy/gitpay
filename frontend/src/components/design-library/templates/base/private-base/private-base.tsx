import React from 'react';
import { AppBar, Container, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Page, PageContent } from '../../../../../styleguide/components/Page';
import ProfileSideBar from '../../../organisms/layouts/profile-sidebar/profile-sidebar'
import AccountHeader from '../../../organisms/layouts/account-header/account-header';
import Bottom from '../../../organisms/layouts/bottom-bar/bottom'
import { useHistory } from 'react-router-dom';
import ProfileHeader from '../../../molecules/sections/profile-header/profile-header';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#F7F7F7',
  },
  containerRoot: {
    padding: theme.spacing(4),
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  secondaryBar: {
    backgroundColor: theme.palette.primary.light
  },
  
}));

const PrivateBase = ({
  children,
  user,
  createTask,
  signOut,
  profileHeaderProps = undefined
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, completed } = user;

  const handleSignOut = () => {
    history.replace({ pathname: '/' })
    signOut()
  }

  return (
    <Page>
      <AppBar
        component='div'
        classes={{ colorPrimary: classes.secondaryBar }}
        color='primary'
        position='static'
        elevation={0} />
      <PageContent>
        <Grid container className={classes.root} spacing={0}>
          <ProfileSideBar
            user={user}
          />
          <Grid item xs={12} md={10}>
            
            <AccountHeader
              user={data}
              onCreateTask={createTask}
              onLogout={handleSignOut}
            />
            
            <Container maxWidth='lg' className={classes.containerRoot}>
            { profileHeaderProps && (
              <ProfileHeader
                title={profileHeaderProps.title}
                subtitle={profileHeaderProps.subtitle}
              />
            )}
              {children}
            </Container>
          </Grid>
        </Grid>
      </PageContent>
      <Bottom getInfo={() => {}} info={{ bounties: 0, tasks: 0, users: 0}} />
    </Page>
  );
}

export default PrivateBase;