import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import mainStyles from '../styles/style'

import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import WorkIcon from 'material-ui-icons/Work'
import AppsIcon from 'material-ui-icons/Apps'
import AssignmentIcon from 'material-ui-icons/Assignment'
import GroupWorkIcon from 'material-ui-icons/GroupWork'
import ArchiveIcon from 'material-ui-icons/Archive'
import CardMembershipIcon from 'material-ui-icons/CardMembership'
import BugReportIcon from 'material-ui-icons/BugReport'
import SubscribeForm from '../form/subscribe-form'

import './mailchimp.css'

import TopBarContainer from '../../containers/topbar'
import InfoContainer from '../../containers/info'
import Bottom from '../../components/bottom/bottom'
import LoginButton from '../../components/session/login-button'

import messages from './messages'

import OurStack from './components/OurStack'

const freelancerImage = require('../../images/welcome-freelancer.png')
const companiesImage = require('../../images/welcome-companies.png')
const deal = require('../../images/deal.png')

import {
  MainTitle,
  MainList,
  MainBanner,
  ResponsiveImage,
  Section
} from './components/CommonStyles'

const styles = (theme) => mainStyles(theme)

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
                  <FormattedMessage id='welcome.tagline' defaultMessage='Welcome to Gitpay' />
                </Typography>
                <Typography variant='title' gutterBottom>
                  <FormattedMessage id='welcome.tagline1' defaultMessage='Work in tasks on demand' />
                </Typography>
                <Typography type='subheading' gutterBottom noWrap>
                  <FormattedHTMLMessage
                    id='welcome.tagline2' defaultMessage='and receive bounty for your contributions' />
                </Typography>
                <div className='subscribe-form'>
                  <SubscribeForm type='subscribe-form-main' />
                </div>
              </div>

              <div className={ classes.mainBlock } style={ { paddingBottom: 40 } }>
                <LoginButton referer={ location } contrast includeForm={ false } />
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
                <Typography variant='headline' gutterBottom>
                  <FormattedMessage id='welcome.headline.forfreelancers' defaultMessage='For freelancers' />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <AppsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemOnePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemOneSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemTwoPrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemTwoSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemThreePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeFreelancersItemThreeSecondary) }
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

        <Section alternative className={ classes.bgContrast }>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='headline' gutterBottom>
                  <FormattedMessage id='welcome.tagline.companies.main.headline' defaultMessage='For companies' />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemOnePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemOneSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <GroupWorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemTwoPrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemTwoSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemThreePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCompaniesItemThreeSecondary) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='500' src={ companiesImage } />
            </Grid>
          </Grid>
        </Section>

        <Section>
          <MainTitle>
            <Typography variant='headline' gutterBottom>
              <FormattedMessage id='welcome.tagline.headline.how.title' defaultMessage='How it works' />
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
                      primary={ this.props.intl.formatMessage(messages.welcomeHowToItemOnePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeHowToItemOneSecondary) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeHowToItemTwoPrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeHowToItemTwoSecondary) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <CardMembershipIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeHowToItemThreePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeHowToItemThreeSecondary) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeHowToItemFourPrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeHowToItemFourSecondary) }
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
