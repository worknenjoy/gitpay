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

class HowItWorksPeople extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
          <FormattedMessage id='welcome.how.title' defaultMessage='How it works'>
            { (msg) => (
              <ListItemText primary={ msg } />
            ) }
          </FormattedMessage>
        </Typography>
        <Dialog
          fullScreen
          TransitionComponent={ Transition }
          open={ this.state.open }
          onClose={ this.handleClose }
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton
                color='inherit'
                onClick={ this.handleClose }
                aria-label='Close'
              >
                <Close />
              </IconButton>
              <Typography variant='h6' className={ classes.appBarHeader }>
                <FormattedMessage id='welcome.how.people.title.freelancer' defaultMessage='For Freelancer' />
              </Typography>
            </Toolbar>
            <div className={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='h6' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.how.people.title' defaultMessage='How it works' />
                </Typography>
              </MainTitle>
            </div>
            <InfoList>
              <List>
                <ListItem className={ classes.lilstIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <Apps />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.consultingItemPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.consultingItemSecondary) }
                  />
                </ListItem>

                <ListItem className={ classes.lilstIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <Work />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.consultingItemTwoPrimary) }
                    secondary={ this.props.intl.formatMessage(messages.consultingItemTwoSecondary) }
                  />
                </ListItem>

                <ListItem className={ classes.lilstIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <AccountBalanceWallet />
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
