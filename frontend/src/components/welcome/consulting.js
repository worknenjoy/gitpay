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
  consultingItemPrimary: {
    id: 'welcome.consulting.item.primary',
    defaultMessage: 'We provide for you help to use agile processes and push your company forward'
  },
  consultingItemSecondary: {
    id: 'welcome.consulting.item.secondary',
    defaultMessage: 'You create demmands for your business and we make this happen using agile tools'
  },
  consultingItemTwoPrimary: {
    id: 'welcome.consulting.item.two.primary',
    defaultMessage: 'For all kind of roles'
  },
  consultingItemTwoSecondary: {
    id: 'welcome.consulting.item.two.secondary',
    defaultMessage: 'Our platform is made by passionate developers, and we wish to expand our agile processes to other roles, with the powers of Git to help with content management'
  },
  consultingItemThreePrimary: {
    id: 'welcome.consulting.item.three.primary',
    defaultMessage: 'We work with deliveries on the cloud'
  },
  consultingItemThreeSecondary: {
    id: 'welcome.consulting.item.three.secondary',
    defaultMessage: 'We support the infrastructure using very known services like Amazon, Heroku and Google Cloud, we just need that your project is connected with Git'
  }
})

class Consulting extends Component {
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
        <FormattedMessage id='welcome.how.consulting.main.title' defaultMessage='Consultancy'>
          { (msg) => (
            <ListItemText primary={ msg } />
          ) }
        </FormattedMessage>
        <Dialog
          fullScreen
          open={ this.state.open }
          onClose={ this.handleClose }
          transition={ Transition }
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton color='inherits' onClick={ this.handleClose } aria-label='Close'>
                <CloseIcon />
              </IconButton>
              <Typography variant='title' className={ classes.appBarHeader }>
                <FormattedMessage id='welcome.consulting.title.company' defaultMessage='For companies' />
              </Typography>
            </Toolbar>
            <div className={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.consulting.title.consulting' defaultMessage='Consulting' />
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
                    primary={ this.props.intl.formatMessage(messages.consultingItemPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.consultingItemSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.consultingItemTwoPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.consultingItemTwoSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.consultingItemThreePrimary) }
                    secondary={ this.props.intl.formatMessage(messages.consultingItemThreeSecondary) }
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

Consulting.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(Consulting)
