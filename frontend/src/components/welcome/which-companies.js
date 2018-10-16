import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import AppsIcon from 'material-ui-icons/Apps'
import WorkIcon from 'material-ui-icons/Work'
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import Transition from '../transition'

import { InfoList, MainTitle } from './components/CommonStyles'

const messages = defineMessages({
  companiesItemPrimary: {
    id: 'welcome.companies.item.primary',
    defaultMessage: 'For any company'
  },
  companiesItemSecondary: {
    id: 'welcome.companies.item.secondary',
    defaultMessage: 'The distributed colaboration helps company grows and provide a great solution to have the tasks solved using agile process and colaboration throught development'
  },
  companiesItemTwoPrimary: {
    id: 'welcome.companies.item.two.primary',
    defaultMessage: 'A community of passionate colaborators'
  },
  companiesItemTwoSecondary: {
    id: 'welcome.companies.item.two.secondary',
    defaultMessage: 'Companies will be able to use Open Source if they want to create colaborative tools that will help other companies and contribute with the OSS ecosystem'
  },
  companiesItemThreePrimary: {
    id: 'welcome.companies.item.three.primary',
    defaultMessage: 'We validate your business integration process'
  },
  companiesItemThreeSecondary: {
    id: 'welcome.companies.item.three.secondary',
    defaultMessage: 'We will help to fit in agile process to have your tasks concluded in an independent way and according to your business'
  }
})

class WhichCompanies extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {

  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  render () {
    const { classes } = this.props

    return (
      <ListItem button onClick={ this.handleClickOpen } component='a'>
        <ListItemText primary='Para quais empresas?' />
        <Dialog
          fullScreen
          open={ this.state.open }
          onClose={ this.handleClose }
          transition={ Transition }
        >
          <AppBar className={ classes.appBar } >
            <Toolbar>
              <IconButton color='inherits' onClick={ this.handleClose } aria-label='Close'>
                <CloseIcon />
              </IconButton>
              <Typography variant='title' className={ classes.appBarHeader }>
                <FormattedMessage id='welcome.companies.title' defaultMessage='For companies' />
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.companies.title.which' defaultMessage='Which companies?' />
                </Typography>
              </MainTitle>
            </div>
            <InfoList>
              <List>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AppsIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={this.props.intl.formatMessage(messages.companiesItemPrimary)}
                    secondary={this.props.intl.formatMessage(messages.companiesItemSecondary)}
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={this.props.intl.formatMessage(messages.companiesItemTwoPrimary)}
                    secondary={this.props.intl.formatMessage(messages.companiesItemTwoSecondary)}
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={this.props.intl.formatMessage(messages.companiesItemThreePrimary)}
                    secondary={this.props.intl.formatMessage(messages.companiesItemThreeSecondary)}
                  />
                </ListItem>
              </List>
            </InfoList>
          </AppBar>
        </Dialog>
      </ListItem>
    )
  }
}

WhichCompanies.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(WhichCompanies)
