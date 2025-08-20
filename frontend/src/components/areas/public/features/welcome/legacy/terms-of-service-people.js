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
} from '@mui/material'
import {
  Apps,
  Close
} from '@mui/icons-material'

import Transition from 'design-library/atoms/transitions/transition'
import messages from './messages'

import { InfoList, MainTitle } from '../components/CommonStyles'

class TermsOfServicePeople extends Component {
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
          <FormattedMessage id='welcome.terms.main.title' defaultMessage='Terms Of Service'>
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
              <Typography variant='h5' className={ classes.appBarHeader }>
                <FormattedMessage id='welcome.terms.contrib.title' defaultMessage='For Contributors' />
              </Typography>
            </Toolbar>
            <div className={ classes.spacedTop }>
              <MainTitle>
                <Typography variant='h5' className={ classes.appBarHeader } gutterBottom>
                  <FormattedMessage id='welcome.terms.main.title' defaultMessage='Terms Of Service' />
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
                    primary={ this.props.intl.formatMessage(messages.termsItemOnePrimary) }
                    secondary={ this.props.intl.formatMessage(messages.termsItemOneSecondary) }
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

TermsOfServicePeople.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(TermsOfServicePeople)
