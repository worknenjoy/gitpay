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
    id: 'welcome.how.item.primary',
    defaultMessage: 'Once subscribed you will know when new tasks are available to assign'
  },
  consultingItemSecondary: {
    id: 'welcome.how.item.secondary',
    defaultMessage: 'Clients create demands and they are looking for contributors with different skills'
  },
  consultingItemTwoPrimary: {
    id: 'welcome.how.item.two.primary',
    defaultMessage: 'You are assigned and receive all the instructions need to start'
  },
  consultingItemTwoSecondary: {
    id: 'welcome.how.item.two.secondary',
    defaultMessage: 'You get access to repo info with all you need to start and discuss about possible solutions'
  },
  consultingItemThreePrimary: {
    id: 'welcome.how.item.three.primary',
    defaultMessage: 'We validate your change, integrate the code and you receive a bounty'
  },
  consultingItemThreeSecondary: {
    id: 'welcome.how.item.three.secondary',
    defaultMessage: 'Your change goes to test and your solution will be reviewed and once integrated on the codebase, you receive a bounty'
  }
})

class HowItWorksPeople extends Component {
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
        <FormattedMessage id='welcome.how.title' defaultMessage='How it works'>
          {(msg) => (
            <ListItemText primary={msg} />
          )}
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
                <FormattedMessage id='welcome.how.people.title.freelancer' defaultMessage='For Frelancers' />
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.how.people.title' defaultMessage='How it works' />
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

HowItWorksPeople.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(HowItWorksPeople)
