import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'typeface-roboto'
import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Container
} from '@material-ui/core'

import {
  AccountBalanceWallet,
  Work,
  Apps,
  Assignment,
  GroupWork
} from '@material-ui/icons'

import './mailchimp.css'

import { injectIntl, FormattedMessage } from 'react-intl'

import TopBarContainer from '../../containers/topbar'
import Bottom from '../../components/bottom/bottom'
import Clientlist from './clientlist'
import messages from './messages'
import mainStyles from '../styles/style'

const freelancerImage = require('../../images/welcome-freelancer.png')
const companiesImage = require('../../images/welcome-companies.png')
const teamImage = require('../../images/welcome-teamwork.png')

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from './components/CommonStyles'

const styles = theme => mainStyles(theme)

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { classes } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' hide />
        <Container>
          <Section ref='contrib'>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 } sm={ 6 }>
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
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <Apps />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemOnePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemOneSecondary
                        ) }
                      />
                    </ListItem>

                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <Work />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemTwoPrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemTwoSecondary
                        ) }
                      />
                    </ListItem>

                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemThreePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeFreelancersItemThreeSecondary
                        ) }
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <ResponsiveImage width='600' src={ freelancerImage } />
              </Grid>
            </Grid>
          </Section>
        </Container>
        <Section ref='companies' alternative className={ classes.bgContrast }>
          <Container>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 } sm={ 6 }>
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
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <Assignment />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemOnePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemOneSecondary
                        ) }
                      />
                    </ListItem>
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <GroupWork />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemTwoPrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemTwoSecondary
                        ) }
                      />
                    </ListItem>
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemThreePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCompaniesItemThreeSecondary
                        ) }
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <ResponsiveImage width='500' src={ companiesImage } />
              </Grid>
            </Grid>
          </Container>
        </Section>
        <Container>
          <Section ref='collab'>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 } sm={ 6 }>
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
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <Apps />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemOnePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemOneSecondary
                        ) }
                      />
                    </ListItem>
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <Work />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemTwoPrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemTwoSecondary
                        ) }
                      />
                    </ListItem>
                    <ListItem className={ classes.listIconTop }>
                      <ListItemIcon>
                        <Avatar className={ classes.iconFill }>
                          <AccountBalanceWallet />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemThreePrimary
                        ) }
                        secondary={ this.props.intl.formatMessage(
                          messages.welcomeCollabItemThreeSecondary
                        ) }
                      />
                    </ListItem>
                  </List>
                </MainList>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <ResponsiveImage width='600' src={ teamImage } />
              </Grid>
            </Grid>
          </Section>
        </Container>
        <Bottom />
      </div>
    )
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(Welcome))
