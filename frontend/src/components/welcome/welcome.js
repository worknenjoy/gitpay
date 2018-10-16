import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { injectIntl, defineMessages, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import formProps from '../form/form-props'
import mainStyles from '../styles/style'

import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import WorkIcon from 'material-ui-icons/Work'
import AppsIcon from 'material-ui-icons/Apps'
import AssignmentIcon from 'material-ui-icons/Assignment'
import GroupWorkIcon from 'material-ui-icons/GroupWork'
import ArchiveIcon from 'material-ui-icons/Archive'
import CardMembershipIcon from 'material-ui-icons/CardMembership'
import BugReportIcon from 'material-ui-icons/BugReport'
import SubscribeFrom from 'react-mailchimp-subscribe'

import './mailchimp.css'

import TopBarContainer from '../../containers/topbar'
import InfoContainer from '../../containers/info'
import Bottom from '../../components/bottom/bottom'
import LoginButton from '../../components/session/login-button'

import OurStack from './components/OurStack'

const octodex = require('../../images/octodex.png')
const octodexMotherhubbertocat = require('../../images/octodex-motherhubbertocat-transparent.png')
const deal = require('../../images/deal.png')

import {
  MainTitle,
  MainList,
  MainBanner,
  ResponsiveImage,
  Section
} from './components/CommonStyles'

const styles = (theme) => mainStyles(theme)

const messages = defineMessages({
  welcomeFreelancersItemOnePrimary: {
    id: 'welcome.main.item.one.primary',
    defaultMessage: 'Work in projects using the best development tools'
  },
  welcomeFreelancersItemOneSecondary: {
    id: 'welcome.main.item.one.secondary',
    defaultMessage: 'We use all the Git tools and version control to manage deliveries for our clients'
  },
  welcomeFreelancersItemTwoPrimary: {
    id: 'welcome.main.item.two.primary',
    defaultMessage: 'Colaboration with companies by tasks on demand'
  },
  welcomeFreelancersItemTwoSecondary: {
    id: 'welcome.main.item.two.secondary',
    defaultMessage: 'Work in different projects, you can colaborate and learn with many projects and stacks'
  },
  welcomeFreelancersItemThreePrimary: {
    id: 'welcome.main.item.three.primary',
    defaultMessage: 'Receive bounties by colaboration'
  },
  welcomeFreelancersItemThreeSecondary: {
    id: 'welcome.main.item.three.secondary',
    defaultMessage: 'Receive bounties for the task you concluded with direct payment when your code is merged on the codebase'
  },
  welcomeCompaniesItemOnePrimary: {
    id: 'welcome.companies.item.one.primary',
    defaultMessage: 'Manage the tasks of your projects'
  },
  welcomeCompaniesItemOneSecondary: {
    id: 'welcome.companies.item.one.secondary',
    defaultMessage: 'With our platform the companies are able to manage your tasks on demand with development tools that suits your needs'
  },
  welcomeCompaniesItemTwoPrimary: {
    id: 'welcome.companies.item.two.primary',
    defaultMessage: 'Pay for your tasks concluded with a smart and automated development process'
  },
  welcomeCompaniesItemTwoSecondary: {
    id: 'welcome.companies.item.two.secondary',
    defaultMessage: 'You will have different contributors, with wide experience that will help on the development using tools that they are confortable with established processes'
  },
  welcomeCompaniesItemThreePrimary: {
    id: 'welcome.companies.item.three.primary',
    defaultMessage: 'Develop your business with open source tools, and pay on demand'
  },
  welcomeCompaniesItemThreeSecondary: {
    id: 'welcome.companies.item.three.secondary',
    defaultMessage: 'Companies can use the Gitpay for all the development needs, from create a repository until release, paying for concluded and merged tasks that are integrated in your project for real'
  },
  welcomeHowToItemOnePrimary: {
    id: 'welcome.howto.item.one.primary',
    defaultMessage: 'A new task is created'
  },
  welcomeHowToItemOneSecondary: {
    id: 'welcome.howto.item.one.secondary',
    defaultMessage: 'A new issue, demand, enhancement or suggestion is created on the platform, that represents needs like development, SEO, content, infrastructure or even new ideas'
  },
  welcomeHowToItemTwoPrimary: {
    id: 'welcome.howto.item.two.primary',
    defaultMessage: 'Your demand is send to our community'
  },
  welcomeHowToItemTwoSecondary: {
    id: 'welcome.howto.item.two.secondary',
    defaultMessage: 'Differents colaborators group will be interested to solve this issue for the price invested for that bounty'
  },
  welcomeHowToItemThreePrimary: {
    id: 'welcome.howto.item.three.primary',
    defaultMessage: 'Sent a pull request to receive a bounty'
  },
  welcomeHowToItemThreeSecondary: {
    id: 'welcome.howto.item.three.secondary',
    defaultMessage: 'A Pull Request is send in the repo and once approved the bounty is sent'
  },
  welcomeHowToItemFourPrimary: {
    id: 'welcome.howto.item.four.primary',
    defaultMessage: 'Agile process between business, payment, consulting and development'
  },
  welcomeHowToItemFourSecondary: {
    id: 'welcome.howto.item.four.secondary',
    defaultMessage: 'We want to facilitate the transactions and payment between colaborators and companies by facilitate the development with smart tools, consolidated process already used in agile companies and emerging startups'
  }
})

class Welcome extends Component {
  render () {
    const { classes, location } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer />
        <MainBanner>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } style={ { padding: 0, margin: 0 } }>
              <div className={ classes.mainBlock } style={ { margin: 0, paddingTop: 10 } }>
                <Typography className={ classes.tagline } gutterBottom>
                  <FormattedMessage id='welcome.tagline' deafultMessage='Welcome to Gitpay'  />
                </Typography>
                <Typography variant='title' gutterBottom>
                  <FormattedMessage id='welcome.tagline1' deafultMessage='Work in tasks on demand' />
                </Typography>
                <Typography type='subheading' gutterBottom noWrap>
                  <FormattedHTMLMessage
                    id='welcome.tagline2' deafultMessage='and receive bounty for your contributions' />
                </Typography>

                <div className='subscribe-form'>
                  <SubscribeFrom className='subscribe-form-main' { ...formProps } />
                </div>
              </div>

              <div className={ classes.mainBlock } style={ { paddingBottom: 40 } }>
                <LoginButton referer={ location } contrast />
              </div>
              <InfoContainer />
              <OurStack />
            </Grid>
          </Grid>
        </MainBanner>

        <Section>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography type='headline' gutterBottom>
                  <FormattedMessage id='welcome.headline.forfreelancers' defaultMessage='For freelancers'  />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeFreelancersItemOnePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeFreelancersItemOneSecondary)}
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeFreelancersItemTwoPrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeFreelancersItemTwoSecondary)}
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeFreelancersItemThreePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeFreelancersItemThreeSecondary)}
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='600' src={ octodex } />
            </Grid>
          </Grid>
        </Section>

        <Section alternative>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography type='headline' gutterBottom>
                  <FormattedMessage id='welcome.tagline.companies.main.headline' defaultMessage='For companies'  />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeCompaniesItemOnePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeCompaniesItemOneSecondary)}
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <GroupWorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeCompaniesItemTwoPrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeCompaniesItemTwoSecondary)}
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeCompaniesItemThreePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeCompaniesItemThreeSecondary)}
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='500' src={ octodexMotherhubbertocat } />
            </Grid>
          </Grid>
        </Section>

        <Section>
          <MainTitle>
            <Typography type='headline' gutterBottom>
              <FormattedMessage id='welcome.tagline.headline.how.title' defaultMessage='How it works'  />
            </Typography>
          </MainTitle>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='400' src={ deal } />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <div className={ classes.seclist }>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeHowToItemOnePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeHowToItemOneSecondary)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeHowToItemTwoPrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeHowToItemTwoSecondary)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <CardMembershipIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeHowToItemThreePrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeHowToItemThreeSecondary)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={this.props.intl.formatMessage(messages.welcomeHowToItemFourPrimary)}
                      secondary={this.props.intl.formatMessage(messages.welcomeHowToItemFourSecondary)}
                    />
                  </ListItem>
                </List>
              </div>
            </Grid>
          </Grid>
        </Section>

        <Bottom />
      </div>
    )
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.string,
}

export default injectIntl(withStyles(styles)(Welcome))
