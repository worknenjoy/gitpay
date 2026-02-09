import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { Grid, Typography } from '@mui/material'

import SubscribeForm from '../../../forms/subscribe-forms/subscribe-form/subscribe-form'
import StatsBar from '../../../../molecules/sections/stats-bar/stats-bar'
import SlackCard from './SlackCard'
import GithubCard from './GithubCard'
import VerticalMenuList from '../../../../molecules/lists/vertical-menu-list/vertical-menu-list'

import {
  Container,
  BaseFooter,
  SubscribeFromWrapper,
  SecBlock,
  SpacedDivider,
  LogoImg
} from './bottom-bar-layout.styles'
import PrivacyPolicy from '../../../../molecules/content/terms/privacy-policy/privacy-policy'
import TermsOfService from '../../../../molecules/content/terms/terms-of-service/terms-of-service'
import CookiePolicy from '../../../../molecules/content/terms/cookie-policy/cookie-policy'

import logoCompleteGray from 'images/logo-complete-gray.png'
import logoWorknEnjoy from 'images/worknenjoy-logo.png'

const Bottom = ({ info = { bounties: 0, tasks: 0, users: 0 }, getInfo }) => {
  const history = useHistory()
  const { tasks, bounties, users } = info

  const navigateTo = (path: string) => {
    history.push(path)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const mainMenuItems = [
    { label: <FormattedMessage id="bottom.menu.about-us" defaultMessage="About us" />, onClick: () => navigateTo('/welcome') },
    { label: <FormattedMessage id="bottom.menu.pricing" defaultMessage="Pricing" />, onClick: () => navigateTo('/pricing') },
    { label: <FormattedMessage id="bottom.menu.team" defaultMessage="Team" />, onClick: () => navigateTo('/team') },
    { label: <FormattedMessage id="bottom.menu.documentation" defaultMessage="Documentation" />, onClick: () => window.open('https://docs.gitpay.me/en') },
    { label: <FormattedMessage id="bottom.menu.explore" defaultMessage="Explore" />, onClick: () => navigateTo('/explore/issues') }
  ]

  const legalMenuItems = [
    {
      label: <FormattedMessage id="bottom.menu.privacy-policy" defaultMessage="Privacy Policy" />,
      component: <PrivacyPolicy extraStyles={false} />
    },
    {
      label: (
        <FormattedMessage id="bottom.menu.terms-of-service" defaultMessage="Terms of Service" />
      ),
      component: <TermsOfService extraStyles={false} />
    },
    {
      label: <FormattedMessage id="bottom.menu.cookie-policy" defaultMessage="Cookie Policy" />,
      component: <CookiePolicy extraStyles={false} />
    }
  ]

  return (
    <SecBlock>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <VerticalMenuList
              title={<FormattedMessage id="bottom.menu.main" defaultMessage="Main menu" />}
              items={mainMenuItems}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <VerticalMenuList
              type="dialog"
              title={<FormattedMessage id="bottom.menu.legal" defaultMessage="Legal" />}
              items={legalMenuItems}
            />
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
                  <FormattedMessage id="bottom.company.org" defaultMessage="is part of" />
                </Typography>
                <a href="http://worknenjoy.com" target="_blank" rel="noreferrer">
                  <LogoImg src={logoWorknEnjoy} width="100" />
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
        <SpacedDivider />
        <StatsBar info={getInfo} tasks={tasks} bounties={bounties} users={users} />
      </Container>
    </SecBlock>
  )
}

export default Bottom
