import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@material-ui/core'

import {
  Work,
  Archive,
  CardMembership,
  BugReport
} from '@material-ui/icons'

import { useIntl, FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import messages from '../../../../areas/public/features/welcome/legacy/messages'

const freelancerImage = require('images/collections/collection-flat-build.svg')
const citySoftware = require('images/collections/collection-flat-background.svg')
const deal = require('images/collections/collection-flat-works.svg')

import {
  MainTitle,
  ResponsiveImage,
  Section,
  HeroSection,
  HeroTitle,
  HeroContent,
  HeroActions
} from './CommonStyles'
import { makeStyles } from '@material-ui/core/styles'
import PublicBase from '../../../templates/base/public-base/public-base'


const useStyles = makeStyles((theme) => ({
  sectionBgAlt: {
    backgroundColor: theme.palette.primary.contrastText
  },
  root: {
    flexGrow: 1,
    marginTop: 0
  },
  svg: {
    width: '100%'
  },
  seclist: {
    padding: 20
  },
  listIconTop: {
    marginTop: 20
  },
  gutterTopSmall: {
    marginTop: 20
  },
  button: {
    marginLeft: 20
  }

}))


const Home = ({
  loggedIn,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const history = useHistory()
  const classes = useStyles()
  const intl = useIntl()

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
        <>
          <Section>
            <HeroSection>
              <Grid container spacing={3} alignContent={'flex-end'}>
                <Grid item xs={12} sm={5}>
                  <ResponsiveImage width={580} src={freelancerImage} className={classes.svg} />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <HeroTitle>
                    <Typography variant='h3' gutterBottom align='left'>
                      <FormattedMessage
                        id='home.hero.headline.title'
                        defaultMessage='Collaborate and earn bounties for solving issues from projects'
                      />
                    </Typography>
                  </HeroTitle>
                  <HeroContent>
                    <Typography variant='h6' gutterBottom align='left'>
                      <FormattedMessage
                        id='home.hero.headline.description'
                        defaultMessage='Gitpay is a platform that allows you to collaborate with other developers and earn bounties for solving issues from projects. You can also create your own projects and invite other developers to collaborate with you.'
                      />
                    </Typography>
                  </HeroContent>
                  <HeroActions>
                    <Button
                      variant='text'
                      color='primary'
                      onClick={() => history.push('/tasks/open')}
                    >
                      <FormattedMessage
                        id='home.hero.headline.button.primary'
                        defaultMessage='Work on an issue'
                      />
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.button}
                      style={{ marginLeft: 20 }}
                      onClick={() => history.push('/signup')}
                    >
                      <FormattedMessage
                        id='home.hero.headline.button.secondary'
                        defaultMessage='Import issue'
                      />
                    </Button>
                  </HeroActions>
                </Grid>
              </Grid>
            </HeroSection>
          </Section>

          <Section className={classes.sectionBgAlt}>
            <MainTitle>
              <Typography variant='h5' gutterBottom>
                <FormattedMessage
                  id='welcome.tagline.headline.how.title'
                  defaultMessage='How Gitpay works'
                />
              </Typography>
            </MainTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <div style={{ marginLeft: 20 }}>
                  <ResponsiveImage width='400' src={deal} />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.seclist}>
                  <List>
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <Archive />
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeHowToItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeHowToItemOneSecondary
                        )}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <BugReport />
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeHowToItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeHowToItemTwoSecondary
                        )}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <CardMembership />
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeHowToItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeHowToItemThreeSecondary
                        )}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listIconTop}>
                      <ListItemIcon>
                        <Work />
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeHowToItemFourPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeHowToItemFourSecondary
                        )}
                      />
                    </ListItem>
                  </List>
                </div>
              </Grid>
            </Grid>
          </Section>
          <Section
            style={{
              // background: `url(${citySoftware}) 50% 5px no-repeat`,
              // backgroundSize: 'cover',
              height: 350,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant='h6' gutterBottom style={{ padding: '0 60px' }}>
              <FormattedMessage
                id='welcome.bottom.call'
                defaultMessage='A better way to build your project, a better way to work in projects'
              />
            </Typography>
            <Button
              component='a'
              href='/#/signup'
              size='large'
              variant='contained'
              color='primary'
              className={classes.gutterTopSmall}
            >
              <FormattedMessage
                id='welcome.bottom.link'
                defaultMessage='Get started'
              />
            </Button>
            <Button
              component='a'
              href='https://docs.gitpay.me'
              size='large'
              variant='text'
              color='primary'
              className={classes.gutterTopSmall}
            >
              <FormattedMessage
                id='welcome.bottom.linkAlt'
                defaultMessage='See our documentation'
              />
            </Button>
          </Section>
        </>
      </PublicBase>
    </div>
  )
}

export default Home
