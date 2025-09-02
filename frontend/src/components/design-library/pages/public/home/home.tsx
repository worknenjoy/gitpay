import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Button from '@mui/material/Button'

import {
  Work,
  Archive,
  CardMembership,
  BugReport
} from '@mui/icons-material'

import { useIntl, FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import messages from '../../../../areas/public/features/welcome/legacy/messages'

import freelancerImage from 'images/collections/collection-flat-build.svg'
import citySoftware from 'images/collections/collection-flat-background.svg'
import deal from 'images/collections/collection-flat-works.svg'

import PublicBase from '../../../templates/base/public-base/public-base'

import {
  MainTitle,
  ResponsiveImage,
  Section,
  HeroSection,
  HeroTitle,
  HeroContent,
  HeroActions
} from './CommonStyles'
import {
  Root,
  AltSection,
  BottomCTASection,
  BottomCopy,
  ImageContainer,
  HeroImage,
  SecList,
  ListItemTop,
  GutterTopButton,
  MLButton,
} from './home.styles'


const Home = ({
  loggedIn,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const history = useHistory()
  // using styled components from home.styles
  const intl = useIntl()

  return (
    <Root>
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
                 <Grid size={{ xs: 12, sm: 5 }}>
                    <HeroImage width={580} src={freelancerImage} />
                  </Grid>
                 <Grid size={{ xs: 12, sm: 7 }}>
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
                    <MLButton
                      variant='contained'
                      color='primary'
                      onClick={() => history.push('/signup')}
                    >
                      <FormattedMessage
                        id='home.hero.headline.button.secondary'
                        defaultMessage='Import issue'
                      />
                    </MLButton>
                  </HeroActions>
                </Grid>
              </Grid>
            </HeroSection>
          </Section>

          <AltSection>
            <MainTitle>
              <Typography variant='h5' gutterBottom>
                <FormattedMessage
                  id='welcome.tagline.headline.how.title'
                  defaultMessage='How Gitpay works'
                />
              </Typography>
            </MainTitle>
             <Grid container spacing={3}>
               <Grid size={{ xs: 12, sm: 6 }}>
                  <ImageContainer>
                  <ResponsiveImage width='400' src={deal} />
                </ImageContainer>
              </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                  <SecList>
                  <List>
                    <ListItemTop>
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
                    </ListItemTop>
                    <Divider />
                    <ListItemTop>
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
                    </ListItemTop>
                    <Divider />
                    <ListItemTop>
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
                    </ListItemTop>
                    <Divider />
                    <ListItemTop>
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
                    </ListItemTop>
                  </List>
                </SecList>
              </Grid>
            </Grid>
          </AltSection>
          <BottomCTASection>
            <BottomCopy variant='h6' gutterBottom>
              <FormattedMessage
                id='welcome.bottom.call'
                defaultMessage='A better way to build your project, a better way to work in projects'
              />
            </BottomCopy>
            <GutterTopButton
              component='a'
              href='/#/signup'
              size='large'
              variant='contained'
              color='primary'
            >
              <FormattedMessage
                id='welcome.bottom.link'
                defaultMessage='Get started'
              />
            </GutterTopButton>
            <GutterTopButton
              component='a'
              href='https://docs.gitpay.me'
              size='large'
              variant='text'
              color='primary'
            >
              <FormattedMessage
                id='welcome.bottom.linkAlt'
                defaultMessage='See our documentation'
              />
            </GutterTopButton>
          </BottomCTASection>
        </>
      </PublicBase>
    </Root>
  )
}

export default Home
