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
    defaultMessage: 'The company needs an issue solved on the project'
  },
  consultingItemSecondary: {
    id: 'welcome.how.item.secondary',
    defaultMessage: 'We evaluate your demand and help you to go on the right track'
  },
  consultingItemTwoPrimary: {
    id: 'welcome.how.item.two.primary',
    defaultMessage: 'We can make ideas grows and be executed one by one, in a full development cycle'
  },
  consultingItemTwoSecondary: {
    id: 'welcome.how.item.two.secondary',
    defaultMessage: 'We offer services to make your idea reach the market in a colaborative way with all the competencies in design, content and development, and you pay on demand for each issue concluded'
  },
  consultingItemThreePrimary: {
    id: 'welcome.how.item.three.primary',
    defaultMessage: 'Your task is sent for colaborators'
  },
  consultingItemThreeSecondary: {
    id: 'welcome.how.item.three.secondary',
    defaultMessage: 'Your issue is assigned and delivery on a deadline your provide with the price that you invest for each task'
  }
})

class HowItWorksCompany extends Component {
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
                <FormattedMessage id='welcome.how.title.company' defaultMessage='For companies' />
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.how.title' defaultMessage='How it works' />
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

HowItWorksCompany.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(HowItWorksCompany)
