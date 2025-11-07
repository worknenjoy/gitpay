import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import {
  Grid,
  Typography,
} from '@mui/material'

import SubscribeForm from '../../../forms/subscribe-forms/subscribe-form/subscribe-form'
import StatsBar from '../../../../molecules/sections/stats-bar/stats-bar'
import SlackCard from './SlackCard'
import GithubCard from './GithubCard'
import VerticalMenuList from '../../../../molecules/lists/vertical-menu-list/vertical-menu-list'

import { Container, BaseFooter, SubscribeFromWrapper, SecBlock, SpacedDivider, LogoImg } from './bottom-bar-layout.styles'
import PrivacyPolicy from '../../../../molecules/content/privacy-policy/privacy-policy'
import TermsOfService from '../../../../molecules/content/terms-of-service/terms-of-service'
import CookiePolicy from '../../../../molecules/content/cookie-policy/cookie-policy'

import logoCompleteGray from 'images/logo-complete-gray.png'
import logoWorknEnjoy from 'images/worknenjoy-logo.png'

const Bottom = ({ info = { bounties: 0, tasks: 0, users: 0 }, getInfo }) => {
  const history = useHistory()
  const { tasks, bounties, users } = info

  const mainMenuItems = [
    { label: 'About us', onClick: () => history.push('/welcome') },
    { label: 'Pricing', onClick: () => history.push('/pricing') },
    { label: 'Team', onClick: () => history.push('/team') },
    { label: 'Documentation', onClick: () => window.open('https://docs.gitpay.me/en') },
    { label: 'Explore', onClick: () => history.push('/explore/issues') }
  ]

  const legalMenuItems = [
    {
      label: 'Privacy policy',
      component: <PrivacyPolicy extraStyles={false} />
    },
    {
      label: 'Terms of Service',
      component: <TermsOfService />
    },
    {
      label: 'Cookie Policy',
      component: <CookiePolicy extraStyles={false} />
    }
  ]

  return (
    <SecBlock>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
<<<<<<< HEAD
            <VerticalMenuList 
              title={<FormattedMessage
                id="bottom.menu.main"
                defaultMessage="Main menu"
              />}
              items={mainMenuItems}
            />
=======
            <Typography component="div">
              <strong>
                <FormattedMessage
                  id="bottom.header.subheading.primary"
                  defaultMessage="Main menu"
                />
              </strong>
            </Typography>
            <List component="nav">
              <ListItemButton component="a">
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ display: 'block', width: '100%' }}
                  onClick={() => window.location.assign('/#/welcome')}
                >
                  <FormattedMessage
                    id="welcome.about.title"
                    defaultMessage="About us"
                  />
                </Typography>
              </ListItemButton>
              <ListItemButton component="a">
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ display: 'block', width: '100%' }}
                  onClick={() => window.location.assign('/#/pricing')}
                >
                  <FormattedMessage
                    id="welcome.pricing.title"
                    defaultMessage="Pricing"
                  />
                </Typography>
              </ListItemButton>
              <ListItemButton component="a">
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ display: 'block', width: '100%' }}
                  onClick={() => window.location.assign('/#/team')}
                >
                  <FormattedMessage
                    id="welcome.team.title"
                    defaultMessage="Team"
                  />
                </Typography>
              </ListItemButton>
              <ListItemButton component="a">
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ display: 'block', width: '100%' }}
                  onClick={() => window.open('https://docs.gitpay.me/en')}
                >
                  <FormattedMessage
                    id="welcome.docs.title"
                    defaultMessage="Documentation"
                  />
                </Typography>
              </ListItemButton>
              <ListItemButton component="a">
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{ display: 'block', width: '100%' }}
                  onClick={() => window.location.assign('/#/tasks/open')}
                >
                  <FormattedMessage
                    id="welcome.explore.title"
                    defaultMessage="Explore"
                  />
                </Typography>
              </ListItemButton>
            </List>
>>>>>>> master
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <VerticalMenuList 
              type="dialog"
              title={
                <FormattedMessage
                  id="bottom.menu.legal"
                  defaultMessage="Legal"
                />
<<<<<<< HEAD
              }
              items={legalMenuItems}
            />
=======
              </strong>
            </Typography>
            <List component="nav">
              <BottomSectionDialog
                key="privacy-policy"
                classes={{}}
                title="Legal"
                header="Privacy policy"
                subtitle={'Privacy Policy'}
                content={
                  <PrivacyPolicy extraStyles={false} />
                }
              />
              <BottomSectionDialog
                key="terms-of-service"
                classes={{}}
                title="Legal"
                header="Terms of Service"
                subtitle={'Terms of Service'}
                content={
                  <TermsOfService />
                }
              />
              <BottomSectionDialog
                key="cookie-policy"
                classes={{}}
                title="Legal"
                header="Cookie Policy"
                subtitle={'Cookie Policy'}
                content={
                  <CookiePolicy extraStyles={false} />
                }
              />
            </List>
>>>>>>> master
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
              <BaseFooter
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div>
                  <LogoImg src={logoCompleteGray} width="100" />
                </div>
                <Typography
                  component="span"
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    display: 'inline-block'
                  }}
                >
                  <FormattedMessage
                    id="bottom.company.org"
                    defaultMessage="is part of"
                  />
                </Typography>
                <a href="http://worknenjoy.com" target="_blank" rel="noreferrer">
                  <LogoImg src={logoWorknEnjoy} width="100" />
                </a>
              </BaseFooter>
              <div style={{ textAlign: 'right' }}>
                <Typography variant={'caption'} component="span">
                  <a href="http://worknenjoy.com">worknenjoy, Inc.</a> <br />
                  <abbr>MA: </abbr>
                  9450 SW Gemini Dr
                  PMB 72684
                  Beaverton, Oregon 97008-7105 US
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
        <SpacedDivider />
        <StatsBar info={getInfo} tasks={tasks} bounties={bounties} users={users} />
      </Container>
    </SecBlock>
  )
}

export default Bottom
