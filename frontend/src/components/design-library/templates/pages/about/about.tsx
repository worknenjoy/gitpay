import React, { useRef } from 'react'
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Container,
} from '@material-ui/core'
import { AccountBalanceWallet, Work, Apps, Assignment, GroupWork } from '@material-ui/icons'
import { useIntl, FormattedMessage } from 'react-intl'
import messages from '../../../../areas/public/features/welcome/legacy/messages'
const freelancerImage = require('images//collections/collection-flat-community.svg')
const companiesImage = require('images//collections/collection-flat-companies.svg')
const teamImage = require('images//welcome-teamwork.png')

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from '../home/CommonStyles'
import { makeStyles } from '@material-ui/core/styles'
import PublicBase from '../../base/public-base/public-base'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 0
  },
  listIconTop: {
    marginTop: 20
  },
  iconFill: {
    color: theme.palette.primary.main
  },
  bgContrast: {
    backgroundColor: theme.palette.primary.contrastText
  }
}))

const About = ({
  loggedIn,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const intl = useIntl()
  const classes = useStyles()
  const ref = useRef(null)

  return (
    <div className={classes.root}>
      <PublicBase
        loggedIn={loggedIn}
        bottomBarProps={bottomBarProps}
        accountMenuProps={accountMenuProps}
        loginFormSignupFormProps={loginFormSignupFormProps}
        loginFormForgotFormProps={loginFormForgotFormProps}
        importIssuesProps={importIssuesProps}
      >
        <Container>
          <Section name='contrib' ref={ref}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MainTitle left>
                  <Typography variant='h5' gutterBottom>
                    <FormattedMessage
                      id='welcome.headline.forfreelancers'
                      defaultMessage='For contributors and freelancers'
                    />
                  </Typography>
                </MainTitle>
                <MainList>
                  <List>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <Apps />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemOneSecondary
                        )}
                      />
                    </ListItem>

                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <Work />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemTwoSecondary
                        )}
                      />
                    </ListItem>

                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemThreeSecondary
                        )}
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ResponsiveImage width='800' src={freelancerImage} />
              </Grid>
            </Grid>
          </Section>
        </Container>
        <Section name='companies' ref={ref} alternative className={classes.bgContrast}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MainTitle left>
                  <Typography variant='h5' gutterBottom>
                    <FormattedMessage
                      id='welcome.tagline.companies.main.headline'
                      defaultMessage='For maintainers and organizations'
                    />
                  </Typography>
                </MainTitle>
                <MainList>
                  <List>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <Assignment />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemOneSecondary
                        )}
                      />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <GroupWork />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemTwoSecondary
                        )}
                      />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemThreeSecondary
                        )}
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ResponsiveImage width='600' src={companiesImage} />
              </Grid>
            </Grid>
          </Container>
        </Section>
        <Container>
          <Section name='collab' ref={ref}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MainTitle left>
                  <Typography variant='h5' gutterBottom>
                    <FormattedMessage
                      id='welcome.headline.collab'
                      defaultMessage='Working in development communities'
                    />
                  </Typography>
                </MainTitle>
                <MainList>
                  <List>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <Apps />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemOneSecondary
                        )}
                      />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <Work />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemTwoSecondary
                        )}
                      />
                    </ListItem>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <Avatar className={classes.iconFill}>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemThreeSecondary
                        )}
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ResponsiveImage width='600' src={teamImage} />
              </Grid>
            </Grid>
          </Section>
        </Container>
      </PublicBase>
    </div>
  )
}
export default About
