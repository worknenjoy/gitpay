import React, { useEffect } from 'react';
import { AppBar, Container, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Page, PageContent } from '../../../../../styleguide/components/Page';
import ProfileSideBar from '../../../organisms/layouts/profile-sidebar/profile-sidebar'
import AccountHeader from '../../../organisms/layouts/account-header/account-header';
import Bottom from '../../../organisms/layouts/bottom-bar/bottom'
import { useHistory } from 'react-router-dom';
import ProfileHeader from '../../../molecules/headers/profile-main-header/profile-main-header';
import ActivateAccountDialog from '../../../molecules/dialogs/activate-account-dialog/activate-account-dialog';

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

type PrivateBaseProps = {
  children: React.ReactNode;
  user: any;
  createTask: () => void;
  onResendActivationEmail?: () => void;
  signOut: () => void;
  profileHeaderProps?: {
    title: string;
    subtitle: string;
  };
  bottomProps?: {
    info: {
      bounties: number;
      users: number;
      tasks: number;
    };
    getInfo: () => void;
  };
};

const PrivateBase = ({
  children,
  user,
  createTask,
  onResendActivationEmail,
  signOut,
  profileHeaderProps = undefined,
  bottomProps = { info: { bounties: 0, users: 0, tasks: 0 }, getInfo: () => {} },
}:PrivateBaseProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { data = {}, completed } = user;
  const { email_verified } = data;
  const [ emailNotVerified, setEmailNotVerified ] = React.useState(false);

  const handleSignOut = () => {
    history.replace({ pathname: '/' })
    signOut()
  }

  useEffect(() => {
    if (email_verified === false) {
      setEmailNotVerified(true);
    }
  }, [email_verified]);

  return (
    <Page>
      {emailNotVerified &&
        <ActivateAccountDialog
          open={emailNotVerified}
          completed={completed}
          onResend={onResendActivationEmail}
        />
      }
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
      <Bottom { ...bottomProps } />
    </Page>
  );
}

export default PrivateBase;