import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from '@material-ui/core'
import {
  Apps,
  Work,
  AccountBalanceWallet,
  Close
} from '@material-ui/icons'

import Transition from '../transition'
import messages from './messages'

import { InfoList, MainTitle } from './components/CommonStyles'

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
      <ListItem button component='a'>
        <Typography
          variant='h6'
          onClick={ this.handleClickOpen }
          component='div'
          style={ { display: 'block', width: '100%' } }
        >
          <FormattedMessage id='welcome.how.workflow.main.title' defaultMessage='Workflow'>
            { (msg) => (
              <ListItemText primary={ msg } />
            ) }
          </FormattedMessage>
        </Typography>
        <Dialog
          fullScreen
          open={ this.state.open }
          onClose={ this.handleClose }
          TransitionComponent={ Transition }
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton color='inherit' onClick={ this.handleClose } aria-label='Close'>
                <Close />
              </IconButton>
              <Typography variant='title' className={ classes.appBarHeader }>
                <FormattedMessage id='welcome.how.workflow.contrib.title' defaultMessage='For contributors' />
              </Typography>
            </Toolbar>
            <div className={ classes.spacedTop }>
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
                    <Avatar className={ classes.iconFillAlt }>
                      <Apps />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.workflowItemPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.workflowItemSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <Work />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.workflowItemTwoPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.workflowItemTwoSecondary) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <AccountBalanceWallet />
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
