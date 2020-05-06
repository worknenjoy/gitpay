import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import 'typeface-roboto'
import {
  withStyles,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tabs,
  Tab,
  AppBar,
  Button
} from '@material-ui/core'

import {
  AccountBalanceWallet,
  Work,
  Apps,
  Assignment,
  GroupWork,
  Archive,
  CardMembership,
  BugReport,
  ArrowForward
} from '@material-ui/icons'

import './mailchimp.css'

import scrollToComponent from 'react-scroll-to-component'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import TopBarContainer from '../../containers/topbar'
import InfoContainer from '../../containers/info'
import Bottom from '../../components/bottom/bottom'
import LoginButton from '../../components/session/login-button'
import Pricing from './pricing'
import Clientlist from './clientlist'
import messages from './messages'
import OurStack from './components/OurStack'
import mainStyles from '../styles/style'
import SubscribeForm from '../form/subscribe-form'

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

const styles = theme => mainStyles(theme)
const isIntegrations = ref => ref === 'integrations'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 0
    }

    this.handleSectionTab = this.handleSectionTab.bind(this)
  }

  componentDidMount () {
    const clientX = ReactDOM.findDOMNode(
      this.refs.intro
    ).getBoundingClientRect().width

    this.offsets = { offset: clientX * 0.04, integrations: clientX * 0.06 }
    if (this.offsets.offset > 30) {
      this.offsets = { offset: 30, integrations: 48 }
    }
    const { offset, integrations } = this.offsets

    for (let ref in this.refs) {
      const domNode = ReactDOM.findDOMNode(this.refs[ref])

      const clientY = Math.ceil(domNode.getBoundingClientRect().top)
      const offsetY = isIntegrations(ref)
        ? clientY - integrations
        : clientY - offset

      const position = { [ref]: offsetY }

      this.positions = { ...this.positions, ...position }
    }

    window.addEventListener('scroll', this.handleSectionsScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleSectionsScroll)
  }

  handleSectionTab = ({ currentTarget }, value) => {
    this.setState({ value })

    const ref = this.refs[currentTarget.id]
    const { offset, integrations } = this.offsets
    scrollToComponent(ref, {
      offset: isIntegrations(ref) ? 0 - integrations : 0 - offset,
      align: 'top',
      ease: 'inExpo'
    })
  }

  handleSectionsScroll = () => {
    const scrollPosition = document.documentElement.scrollTop
    const offsetPostion = scrollPosition + this.offsets.offset

    const {
      intro,
      clients,
      contrib,
      companies,
      collab,
      'how-it-works': howItWorks,
      pricing,
      integrations,
      'get-started': getStarted
    } = this.positions

    if (offsetPostion >= getStarted) {
      this.setState({ value: 8 })
    }
    else if (offsetPostion >= integrations) {
      this.setState({ value: 7 })
    }
    else if (offsetPostion >= pricing) {
      this.setState({ value: 6 })
    }
    else if (offsetPostion >= howItWorks) {
      this.setState({ value: 5 })
    }
    else if (offsetPostion >= collab) {
      this.setState({ value: 4 })
    }
    else if (offsetPostion >= companies) {
      this.setState({ value: 3 })
    }
    else if (offsetPostion >= contrib) {
      this.setState({ value: 2 })
    }
    else if (offsetPostion >= clients) {
      this.setState({ value: 1 })
    }
    else if (offsetPostion >= intro) {
      this.setState({ value: 0 })
    }
  }

  render () {
    const { classes, location, logged } = this.props

    return (
      <div className={ classes.root }>
        <TopBarContainer ref='intro' />
        <AppBar position='sticky' color='default'>
          <Tabs
            variant='scrollable'
            value={ this.state.value }
            onChange={ this.handleSectionTab }
            scrollButtons='on'
          >
            <Tab
              id='intro'
              value={ 0 }
              label={ this.props.intl.formatMessage(messages.topMenu1) }
            />
            <Tab
              id='clients'
              value={ 1 }
              label={ this.props.intl.formatMessage(messages.topMenu9) }
            />
            <Tab
              id='contrib'
              value={ 2 }
              label={ this.props.intl.formatMessage(messages.topMenu2) }
            />
            <Tab
              id='companies'
              value={ 3 }
              label={ this.props.intl.formatMessage(messages.topMenu3) }
            />
            <Tab
              id='collab'
              value={ 4 }
              label={ this.props.intl.formatMessage(messages.topMenu4) }
            />
            <Tab
              id='how-it-works'
              value={ 5 }
              label={ this.props.intl.formatMessage(messages.topMenu5) }
            />
            <Tab
              id='pricing'
              value={ 6 }
              label={ this.props.intl.formatMessage(messages.topMenu6) }
            />
            <Tab
              id='integrations'
              value={ 7 }
              label={ this.props.intl.formatMessage(messages.topMenu7) }
            />
            <Tab
              id='get-started'
              value={ 8 }
              label={ this.props.intl.formatMessage(messages.topMenu8) }
            />
          </Tabs>
        </AppBar>
        <MainBanner>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } style={ { padding: 0, margin: 0 } }>
              <div
                className={ classes.mainBlock }
                style={ { margin: 0, paddingTop: 10 } }
              >
                <Typography className={ classes.tagline } gutterBottom>
                  <FormattedMessage
                    id='welcome.tagline'
                    defaultMessage='Welcome to Gitpay'
                  />
                </Typography>
                <Typography variant='h6' gutterBottom>
                  <FormattedMessage
                    id='welcome.tagline1'
                    defaultMessage='Work in tasks on demand'
                  />
                </Typography>
                <Typography type='body1' gutterBottom noWrap>
                  <FormattedHTMLMessage
                    id='welcome.tagline2'
                    defaultMessage='and receive bounty for your contributions'
                  />
                </Typography>
                { !logged &&
                <Button
                  variant='contained'
                  color='secondary'
                  size='large'
                  onClick={ (e) => this.props.openDialog('SignupUser') }
                  style={ { marginTop: 20 } }
                >
                  <FormattedMessage
                    id='general.singup.action'
                    defaultMessage='Signin / Signup'
                  />
                </Button>
                }
                <div className='subscribe-form'>
                  <SubscribeForm render={ false } type='subscribe-form-main' />
                </div>
              </div>
              <div className={ classes.mainBlock } style={ { paddingBottom: 40 } }>
                { !logged ? (
                  <LoginButton referer={ location } contrast includeForm={ false } />
                ) : (
                  <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={ (e) => window.location.assign('/#/profile') }
                    style={ { marginTop: 20 } }
                  >
                    <FormattedMessage
                      id='general.singup.access'
                      defaultMessage='Access your account'
                    />
                  </Button>
                )
                }
              </div>
              <InfoContainer />
              <OurStack />
            </Grid>
          </Grid>
        </MainBanner>

        <Section ref='clients'>
          <Clientlist />
        </Section>

        <Section ref='contrib'>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.headline.forfreelancers'
                    defaultMessage='For freelancers'
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

        <Section ref='companies' alternative className={ classes.bgContrast }>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.tagline.companies.main.headline'
                    defaultMessage='For companies'
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
        </Section>

        <Section ref='collab'>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.headline.collab'
                    defaultMessage='For collaboration'
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

        <Section ref='how-it-works' className={ classes.sectionBgAlt }>
          <MainTitle>
            <Typography variant='h5' gutterBottom>
              <FormattedMessage
                id='welcome.tagline.headline.how.title'
                defaultMessage='How it works'
              />
            </Typography>
          </MainTitle>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='400' src={ deal } />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <div className={ classes.seclist }>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <Archive />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemOnePrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemOneSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReport />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemTwoPrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemTwoSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <CardMembership />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemThreePrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon>
                      <BugReport />
                    </ListItemIcon>
                    <ListItemText
                      primary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemFourPrimary
                      ) }
                      secondary={ this.props.intl.formatMessage(
                        messages.welcomeHowToItemFourSecondary
                      ) }
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
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 4 } className={ classes.alignRight }>
              <div className={ classes.gutterTop }>
                <Typography variant='h6' gutterBottom>
                  <FormattedMessage
                    id='welcome.integration.title'
                    defaultMessage='Integration'
                  />
                </Typography>
                <Typography variant='h4' gutterBottom>
                  <FormattedMessage
                    id='welcome.integration.subtitle'
                    defaultMessage='Check out our Github app'
                  />
                </Typography>
                <Typography variant='body1' gutterBottom>
                  <FormattedMessage
                    id='welcome.integration.desc'
                    defaultMessage='You can install our Gitpay app on your Github and start to boost your issues'
                  />
                </Typography>
                <Button
                  component='a'
                  target='_blank'
                  href='https://github.com/apps/gitpay-me'
                  variant='contained'
                  color='primary'
                  className={ classes.gutterTopSmall }
                >
                  <FormattedMessage
                    id='welcome.integration.button'
                    defaultMessage='Checkout our Github App'
                  />
                  <ArrowForward />
                </Button>
              </div>
            </Grid>
            <Grid item xs={ 12 } sm={ 8 } className={ classes.alignLeft }>
              <ShadowImage width='600' src={ appSnapshotImage } />
            </Grid>
          </Grid>
        </Section>

        <Section
          ref='get-started'
          style={ {
            background: `url(${citySoftware}) no-repeat`,
            backgroundSize: 'cover',
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          } }
        >
          <Typography variant='h6' gutterBottom style={ { padding: '0 60px' } }>
            <FormattedHTMLMessage
              id='welcome.bottom.call'
              defaultMessage='A better way to build your project, <br /> a better way to work in projects'
            />
          </Typography>
          <Button
            component='a'
            href='https://gitpay.me/#/login'
            size='large'
            variant='contained'
            color='primary'
            className={ classes.gutterTopSmall }
          >
            <FormattedMessage
              id='welcome.bottom.link'
              defaultMessage='Get started'
            />
          </Button>
          <Button
            component='a'
            href='https://docs.gitpay.me'
            size='large'
            variant='text'
            color='primary'
            className={ classes.gutterTopSmall }
          >
            <FormattedMessage
              id='welcome.bottom.linkAlt'
              defaultMessage='See our docs'
            />
          </Button>
        </Section>

        <Bottom />
      </div>
    )
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object
}

export default injectIntl(withStyles(styles)(Welcome))
