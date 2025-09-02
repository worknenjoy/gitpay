import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Container } from '@mui/material'
import { AccountBalanceWallet, Work, Apps, Assignment, GroupWork } from '@mui/icons-material'
import { injectIntl, FormattedMessage } from 'react-intl'
import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from 'design-library/organisms/layouts/bottom-bar/bottom'
import messages from './messages'
// removed withStyles/theme styles usage
import freelancerImage from 'images/collections/collection-flat-community.svg'
import companiesImage from 'images/collections/collection-flat-companies.svg'
import teamImage from 'images/welcome-teamwork.png'

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from '../components/CommonStyles'

// legacy styles removed

const Welcome = (props) => {
  const ref = useRef(null)
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    // componentDidMount() equivalent
  }, [])

  React.useEffect(() => {
    // componentWillUnmount() equivalent
    return () => {
      // Clean up code
    }
  }, [])

  const { } = props

  return (
  <div>
      <TopBarContainer hide />
      <Container>
        <Section name='contrib' ref={ ref }>
          <Grid container spacing={ 3 }>
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
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <Apps />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemOneSecondary
                      ) }
                    />
                  </ListItem>

          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemTwoSecondary
                      ) }
                    />
                  </ListItem>

          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResponsiveImage width='800' src={ freelancerImage } />
            </Grid>
          </Grid>
        </Section>
      </Container>
  <Section name='companies' ref={ ref } alternative>
        <Container>
          <Grid container spacing={ 3 }>
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
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <Assignment />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemOneSecondary
                      ) }
                    />
                  </ListItem>
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <GroupWork />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemTwoSecondary
                      ) }
                    />
                  </ListItem>
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResponsiveImage width='600' src={ companiesImage } />
            </Grid>
          </Grid>
        </Container>
      </Section>
      <Container>
        <Section name='collab' ref={ ref }>
          <Grid container spacing={ 3 }>
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
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <Apps />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemOneSecondary
                      ) }
                    />
                  </ListItem>
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemTwoSecondary
                      ) }
                    />
                  </ListItem>
          <ListItem>
                    <ListItemIcon style={ { marginRight: 12 } }>
            <Avatar>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResponsiveImage width='600' src={ teamImage } />
            </Grid>
          </Grid>
        </Section>
      </Container>
      <Bottom />
    </div>
  )
}

Welcome.propTypes = {}

export default injectIntl(Welcome)
