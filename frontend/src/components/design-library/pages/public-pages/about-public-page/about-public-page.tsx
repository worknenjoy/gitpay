import React, { useRef } from 'react'
import {
  Grid,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material'
import { AccountBalanceWallet, Work, Apps, Assignment, GroupWork } from '@mui/icons-material'
import { useIntl, FormattedMessage } from 'react-intl'
import messages from '../../../../areas/public/features/welcome/legacy/messages'
import freelancerImage from 'images/collections/collection-flat-community.svg'
import companiesImage from 'images/collections/collection-flat-companies.svg'
import teamImage from 'images/welcome-teamwork.png'

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from '../home-public-page/CommonStyles'
import PublicBase from '../../../templates/base/public-base/public-base'

// new styled components
import { Root, ListItemTop, AvatarPrimary, SectionBgContrast } from './about-public-page.styles'

const About = ({
  loggedIn,
  bottomBarProps,
  accountMenuProps,
  loginFormSignupFormProps,
  loginFormForgotFormProps,
  importIssuesProps
}) => {
  const intl = useIntl()
  const ref = useRef(null)

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
        <Container>
          <div id='contrib' ref={ref}>
            <Section>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <Apps />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemOneSecondary
                        )}
                      />
                    </ListItemTop>

                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <Work />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemTwoSecondary
                        )}
                      />
                    </ListItemTop>

                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <AccountBalanceWallet />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeFreelancersItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeFreelancersItemThreeSecondary
                        )}
                      />
                    </ListItemTop>
                  </List>
                </MainList>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ResponsiveImage width='800' src={freelancerImage} />
              </Grid>
            </Grid>
            </Section>
          </div>
        </Container>
        <div id='companies' ref={ref}>
          <SectionBgContrast alternative>
          <Container>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <Assignment />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemOneSecondary
                        )}
                      />
                    </ListItemTop>
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <GroupWork />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemTwoSecondary
                        )}
                      />
                    </ListItemTop>
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <AccountBalanceWallet />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCompaniesItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCompaniesItemThreeSecondary
                        )}
                      />
                    </ListItemTop>
                  </List>
                </MainList>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ResponsiveImage width='600' src={companiesImage} />
              </Grid>
            </Grid>
          </Container>
          </SectionBgContrast>
        </div>
        <Container>
          <div id='collab' ref={ref}>
            <Section>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <Apps />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemOnePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemOneSecondary
                        )}
                      />
                    </ListItemTop>
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <Work />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemTwoPrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemTwoSecondary
                        )}
                      />
                    </ListItemTop>
                    <ListItemTop>
                      <ListItemIcon style={{ marginRight: 12 }}>
                        <AvatarPrimary>
                          <AccountBalanceWallet />
                        </AvatarPrimary>
                      </ListItemIcon>
                      <ListItemText
                        primary={intl.formatMessage(
                          messages.welcomeCollabItemThreePrimary
                        )}
                        secondary={intl.formatMessage(
                          messages.welcomeCollabItemThreeSecondary
                        )}
                      />
                    </ListItemTop>
                  </List>
                </MainList>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ResponsiveImage width='600' src={teamImage} />
              </Grid>
            </Grid>
            </Section>
          </div>
        </Container>
      </PublicBase>
    </Root>
  )
}
export default About
