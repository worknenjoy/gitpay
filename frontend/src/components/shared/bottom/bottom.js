import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { Grid, Typography, Divider, List, ListItem } from '@mui/material'

import SubscribeForm from 'design-library/organisms/forms/subscribe-forms/subscribe-form/subscribe-form'
import InfoContainer from '../../../containers/info'
import SlackCard from './SlackCard'
import GithubCard from './GithubCard'

import { Container, BaseFooter, SubscribeFromWrapper } from './FooterStyles'

import BottomSectionDialog from '../../areas/public/features/welcome/components/BottomSectionDialog'
import PrivacyPolicy from '../../areas/private/components/session/privacy-policy'
import TermsOfService from '../../areas/private/components/session/terms-of-service'
import CookiePolicy from '../../areas/private/components/session/cookie-policy'

import logoCompleteGray from 'images/logo-complete-gray.png'
import logoWorknEnjoy from 'images/worknenjoy-logo.png'

class Bottom extends Component {
  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 8,
          backgroundColor: '#f1f0ea'
        }}
      >
        <Container>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography component="div">
                <strong>
                  <FormattedMessage
                    id="bottom.header.subheading.primary"
                    defaultMessage="Main menu"
                  />
                </strong>
              </Typography>
              <List component="nav">
                <ListItem button component="a">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => window.location.assign('/#/welcome')}
                  >
                    <FormattedMessage id="welcome.about.title" defaultMessage="About us" />
                  </Typography>
                </ListItem>
                <ListItem button component="a">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => window.location.assign('/#/pricing')}
                  >
                    <FormattedMessage id="welcome.pricing.title" defaultMessage="Pricing" />
                  </Typography>
                </ListItem>
                <ListItem button component="a">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => window.location.assign('/#/team')}
                  >
                    <FormattedMessage id="welcome.team.title" defaultMessage="Team" />
                  </Typography>
                </ListItem>
                <ListItem button component="a">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => window.open('https://docs.gitpay.me/en')}
                  >
                    <FormattedMessage id="welcome.docs.title" defaultMessage="Documentation" />
                  </Typography>
                </ListItem>
                <ListItem button component="a">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    style={{ display: 'block', width: '100%' }}
                    onClick={() => window.location.assign('/#/tasks/open')}
                  >
                    <FormattedMessage id="welcome.explore.title" defaultMessage="Explore" />
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography component="div">
                <strong>
                  <FormattedMessage
                    id="bottom.header.subheading.secondary"
                    defaultMessage="Legal"
                  />
                </strong>
              </Typography>
              <List component="nav">
                <BottomSectionDialog
                  title="Legal"
                  header="Privacy policy"
                  subtitle={'Privacy Policy'}
                  content={<PrivacyPolicy extraStyles={false} />}
                />
                <BottomSectionDialog
                  title="Legal"
                  header="Terms of Service"
                  subtitle={'Terms of Service'}
                  content={<TermsOfService extraStyles={false} />}
                />
                <BottomSectionDialog
                  title="Legal"
                  header="Cookie Policy"
                  subtitle={'Cookie Policy'}
                  content={<CookiePolicy extraStyles={false} />}
                />
              </List>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <SlackCard />
              <GithubCard />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography component="div">
                <FormattedMessage
                  id="bottom.subheading.newsletter"
                  defaultMessage="If you want to get in touch, leave your e-mail with our news and challenges!"
                />
              </Typography>
              <SubscribeFromWrapper className="subscribe-form">
                <SubscribeForm render />
              </SubscribeFromWrapper>
              <div style={{ float: 'right' }}>
                <BaseFooter style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={logoCompleteGray} width="100" />
                  </div>
                  <Typography
                    component="span"
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      display: 'inline-block'
                    }}
                  >
                    <FormattedMessage id="bottom.company.org" defaultMessage="is part of" />
                  </Typography>
                  <a href="http://worknenjoy.com" target="_blank" rel="noreferrer">
                    <img src={logoWorknEnjoy} width="100" />
                  </a>
                </BaseFooter>
                <div style={{ textAlign: 'right' }}>
                  <Typography variant={'caption'} component="span">
                    <a href="http://worknenjoy.com">worknenjoy, Inc.</a> <br />
                    <abbr>MA: </abbr>
                    9450 SW Gemini Dr PMB 72684 Beaverton, Oregon 97008-7105 US
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
          <InfoContainer />
        </Container>
      </div>
    )
  }
}

Bottom.propTypes = {}

export default Bottom
