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

class WhichCompanies extends Component {
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
          <FormattedMessage id='welcome.companies.title.which' defaultMessage='Which companies?'>
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
                <FormattedMessage id='welcome.companies.title' defaultMessage='For companies' />
              </Typography>
            </Toolbar>
            <div className={ classes.spacedTop }>
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
                    <Avatar className={ classes.iconFillAlt }>
                      <Apps />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.companiesItemPrimary1) }
                    secondary={ this.props.intl.formatMessage(messages.companiesItemSecondary1) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <Work />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.companiesItemTwoPrimary1) }
                    secondary={ this.props.intl.formatMessage(messages.companiesItemTwoSecondary1) }
                  />
                </ListItem>
                <ListItem className={ classes.listIconTop }>
                  <ListItemIcon>
                    <Avatar className={ classes.iconFillAlt }>
                      <AccountBalanceWallet />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={ this.props.intl.formatMessage(messages.companiesItemThreePrimary1) }
                    secondary={ this.props.intl.formatMessage(messages.companiesItemThreeSecondary1) }
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
