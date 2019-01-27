import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Tabs from 'material-ui/Tabs/Tabs'
import Tab from 'material-ui/Tabs/Tab'
import AppBar from 'material-ui/AppBar'
import mainStyles from '../styles/style'
import scrollToComponent from 'react-scroll-to-component'

import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import WorkIcon from 'material-ui-icons/Work'
import AppsIcon from 'material-ui-icons/Apps'
import AssignmentIcon from 'material-ui-icons/Assignment'
import GroupWorkIcon from 'material-ui-icons/GroupWork'
import ArchiveIcon from 'material-ui-icons/Archive'
import CardMembershipIcon from 'material-ui-icons/CardMembership'
import BugReportIcon from 'material-ui-icons/BugReport'
import SubscribeForm from '../form/subscribe-form'
import ArrowIcon from 'material-ui-icons/ArrowForward'

import './mailchimp.css'

import TopBarContainer from '../../containers/topbar'
import InfoContainer from '../../containers/info'
import Bottom from '../../components/bottom/bottom'
import LoginButton from '../../components/session/login-button'
import Pricing from './pricing'

import messages from './messages'

import OurStack from './components/OurStack'

const freelancerImage = require('../../images/welcome-freelancer.png')
const companiesImage = require('../../images/welcome-companies.png')
const teamImage = require('../../images/welcome-teamwork.png')
const appSnapshotImage = require('../../images/gitpay-app.png')
const citySoftware = require('../../images/city-software.png')
const deal = require('../../images/deal.png')

import {
  MainTitle,
  MainList,
  MainBanner,
  ResponsiveImage,
  ShadowImage,
  Section
} from './components/CommonStyles'
import { Button } from 'material-ui'

const styles = (theme) => mainStyles(theme)

class Welcome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 0
    }
  }

  componentDidMount () {
    // window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {

  }

  handleSectionTab = (event, value) => {
    this.setState({ value })
    let offset = -30
    if (event.currentTarget.id === 'integrations') offset = -50
    scrollToComponent(this.refs[event.currentTarget.id], {
      offset: offset,
      align: 'top',
      ease: 'inExpo'
    })
  }

  render () {
    const { classes, location } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' />
        <AppBar position='sticky' color='default'>
          <Tabs variant='default' value={ this.state.value } onChange={ this.handleSectionTab }>
            <Tab id='intro' value={ 0 } label={ this.props.intl.formatMessage(messages.topMenu1) } />
            <Tab id='contrib' value={ 1 } label={ this.props.intl.formatMessage(messages.topMenu2) } />
            <Tab id='companies' value={ 2 } label={ this.props.intl.formatMessage(messages.topMenu3) } />
            <Tab id='collab' value={ 3 } label={ this.props.intl.formatMessage(messages.topMenu4) } />
            <Tab id='how-it-works' value={ 4 } label={ this.props.intl.formatMessage(messages.topMenu5) } />
            <Tab id='pricing' value={ 5 } label={ this.props.intl.formatMessage(messages.topMenu6) } />
            <Tab id='integrations' value={ 6 } label={ this.props.intl.formatMessage(messages.topMenu7) } />
            <Tab id='get-started' value={ 7 } label={ this.props.intl.formatMessage(messages.topMenu8) } />
          </Tabs>
        </AppBar>
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
        <Section ref='contrib'>
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
        <Section ref='companies' alternative className={ classes.bgContrast }>
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
        <Section ref='collab'>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='headline' gutterBottom>
                  <FormattedMessage id='welcome.headline.collab' defaultMessage='For collaboration' />
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
                      primary={ this.props.intl.formatMessage(messages.welcomeCollabItemOnePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCollabItemOneSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <WorkIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeCollabItemTwoPrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCollabItemTwoSecondary) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWalletIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(messages.welcomeCollabItemThreePrimary) }
                      secondary={ this.props.intl.formatMessage(messages.welcomeCollabItemThreeSecondary) }
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
        <Section ref='how-it-works' className={ classes.sectionBgAlt }>
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
        <Section ref='pricing'>
          <Pricing />
        </Section>
        <Section ref='integrations' className={ classes.gutterBottomBig }>
          <Grid container spacing={ 24 }>
            <Grid item xs={ 12 } sm={ 4 } className={ classes.alignRight }>
              <div className={ classes.gutterTop }>
                <Typography variant='caption' gutterBottom>
                  <FormattedMessage id='welcome.integration.title' defaultMessage='Integration' />
                </Typography>
                <Typography variant='headline' gutterBottom>
                  <FormattedMessage id='welcome.integration.subtitle' defaultMessage='Check out our Github app' />
                </Typography>
                <Typography variant='subheading' gutterBottom>
                  <FormattedMessage id='welcome.integration.desc' defaultMessage='You can install our Gitpay app on your Github and start to boost your issues' />
                </Typography>
                <Button component='a' target='_blank' href='https://github.com/apps/gitpay-me' variant='raised' color='primary' className={ classes.gutterTopSmall }>
                  <FormattedMessage id='welcome.integration.button' defaultMessage='Checkout our Github App' />
                  <ArrowIcon />
                </Button>
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 8 } className={ classes.alignLeft }>
              <ShadowImage width='600' src={ appSnapshotImage } />
            </Grid>
          </Grid>
        </Section>
        <Section ref='get-started' style={ { background: `url(${citySoftware}) no-repeat`, backgroundSize: 'contain', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }>
          <Typography variant='display1' gutterBottom style={ { padding: '0 220px' } }>
            <FormattedHTMLMessage id='welcome.bottom.call' defaultMessage='A better way to build your project, <br /> a better way to work in projects' />
          </Typography>
          <Button component='a' href='https://gitpay.me/#/login' size='large' variant='raised' color='primary' className={ classes.gutterTopSmall }>
            <FormattedMessage id='welcome.bottom.link' defaultMessage='Get started' />
          </Button>
          <Button component='a' href='https://docs.gitpay.me' size='large' variant='flat' color='primary' className={ classes.gutterTopSmall }>
            <FormattedMessage id='welcome.bottom.linkAlt' defaultMessage='See our docs' />
          </Button>
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
