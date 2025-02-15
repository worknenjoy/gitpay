import React, { useState, useEffect } from 'react'
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

import Transition from '../../../../design-library/atoms/transitions/transition'
import messages from './messages'

import { InfoList, MainTitle } from './components/CommonStyles'

const Consulting = ({ classes, ...props }) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    // Component did mount functionality here
  }, [])

  return (
    <ListItem button component='a'>
      <Typography
        variant='h6'
        onClick={handleClickOpen}
        component='div'
        style={{ display: 'block', width: '100%' }}
      >
        <FormattedMessage id='welcome.how.consulting.main.title' defaultMessage='Privacy'>
          {(msg) => (
            <ListItemText primary={msg} />
          )}
        </FormattedMessage>
      </Typography>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color='inherit' onClick={handleClose} aria-label='Close'>
              <Close />
            </IconButton>
            <Typography variant='h5' className={classes.appBarHeader}>
              <FormattedMessage id='welcome.consulting.title.company' defaultMessage='For companies' />
            </Typography>
          </Toolbar>
          <div className={classes.spacedTop}>
            <MainTitle>
              <Typography variant='h5' className={classes.appBarHeader} gutterBottom>
                <FormattedMessage id='welcome.consulting.title.consulting' defaultMessage='Privacy' />
              </Typography>
            </MainTitle>
          </div>
          <InfoList>
            <List>
              <ListItem className={classes.listIconTop}>
                <ListItemIcon>
                  <Avatar className={classes.iconFillAlt}>
                    <Apps />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={props.intl.formatMessage(messages.workflowItemPrimary)}
                  secondary={props.intl.formatMessage(messages.workflowItemSecondary)}
                />
              </ListItem>
              <ListItem className={classes.listIconTop}>
                <ListItemIcon>
                  <Avatar className={classes.iconFillAlt}>
                    <Work />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={props.intl.formatMessage(messages.workflowItemTwoPrimary)}
                  secondary={props.intl.formatMessage(messages.workflowItemTwoSecondary)}
                />
              </ListItem>
              <ListItem className={classes.listIconTop}>
                <ListItemIcon>
                  <Avatar className={classes.iconFillAlt}>
                    <AccountBalanceWallet />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={props.intl.formatMessage(messages.workflowItemThreePrimary)}
                  secondary={props.intl.formatMessage(messages.workflowItemThreeSecondary)}
                />
              </ListItem>
            </List>
          </InfoList>
        </AppBar>
      </Dialog>
    </ListItem>
  )
}

Consulting.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(Consulting)
