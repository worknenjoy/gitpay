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
  workflowItemPrimary: {
    id: 'welcome.workflow.item.primary',
    defaultMessage: 'Gitpay is for all'
  },
  workflowItemSecondary: {
    id: 'welcome.workflow.item.secondary',
    defaultMessage: 'Clients, team leads, designers, content creators and managers, everyone can follow the progress and status using already known tools to manage their projects for remote teams'
  },
  workflowItemTwoPrimary: {
    id: 'welcome.workflow.item.two.primary',
    defaultMessage: 'For all levels'
  },
  workflowItemTwoSecondary: {
    id: 'welcome.workflow.item.two.secondary',
    defaultMessage: 'Beginners will learn for real of how contribute to real companies with real projects, experienced contributors can help with revisions and hard tasks, and is possible to choose projects and tasks that you want to grow or that you are familiar and confortable to work with '
  },
  workflowItemThreePrimary: {
    id: 'welcome.workflow.item.three.primary',
    defaultMessage: 'Learn by doing and receive bounties'
  },
  workflowItemThreeSecondary: {
    id: 'welcome.workflow.item.three.secondary',
    defaultMessage: 'Work in different projects and create solutions with distributed teams around the world, using tools that you are familiar and propose solutions for issues that you know. You will be able to be assigned for new challenges'
  }
})

class Workflow extends Component {
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
        <FormattedMessage id='welcome.how.workflow.main.title' defaultMessage='Workflow'>
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
                <FormattedMessage id='welcome.how.workflow.contrib.title' defaultMessage='For contributors' />
              </Typography>
            </Toolbar>
            <div classeName={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='title' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.how.workflow.main.title' defaultMessage='Workflow' />
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
                    primary={ this.props.intl.formatMessage(messages.workflowItemPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.workflowItemSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.workflowItemTwoPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.workflowItemTwoSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.workflowItemThreePrimary) }
                    secondary={ this.props.intl.formatMessage(messages.workflowItemThreeSecondary) }
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

Workflow.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(Workflow)
