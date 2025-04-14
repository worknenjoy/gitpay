import React from 'react';

const PrivateBase = ({
  classes,
  user,
  roles,
}) => {
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
          {user &&
            <ProfileSideBar
              classes={classes}
              user={user}
              onLogout={this.handleSignOut}
              history={this.props.history}
            />
          }
          <Grid item xs={12} md={10}>
            <AccountHeader
              classes={classes}
              user={user}
              onCreateTask={this.props.createTask}
              history={this.props.history}
              onLogout={this.handleSignOut}
            />
            <Container maxWidth='lg'>
              {children}
            </Container>
          </Grid>
        </Grid>
      </PageContent>
      <BottomContainer
        classes={classes}
      />
    </Page>
  );
}

export default PrivateBase;