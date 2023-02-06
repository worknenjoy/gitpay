import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import {
  Typography,
  withStyles,
  Paper,
  Grid,
  Menu,
  MenuItem,
  Button,
  Switch
} from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'

import { LabelButton, StyledAvatarIconOnly } from '../topbar/TopbarStyles'

import { FormattedMessage, injectIntl } from 'react-intl'

const logoLangEn = require('../../images/united-states-of-america.png')
const logoLangBr = require('../../images/brazil.png')

const styles = theme => ({
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  deleteButton: {
    marginTop: 40,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.light
    }
  }
})

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      anchorEl: null,
      selectedLanguage: null,
      receiveNotifications: props.user.receiveNotifications
    }
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleLanguageClick = (lang) => {
    this.setState({ selectedLanguage: lang, anchorEl: null }, async () => {
      try {
        await this.props.updateUser(this.props.user.id, {
          language: this.state.selectedLanguage
        })
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log('error', e)
      }
    })
  }

  handleHiddenChange = async (event, hidden) => {
    this.setState(state => ({
      'receiveNotifications': !this.state.receiveNotifications,
    }))
    try {
      await this.props.updateUser(this.props.user.id, {
        receiveNotifications: event.currentTarget.checked
      })
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('error', e)
    }
  }

  render () {
    const { classes, user } = this.props
    const { anchorEl, selectedLanguage } = this.state
    const language = selectedLanguage || user.language

    return (
      <Paper elevation={ 0 }>
        <Grid container alignItems='center' spacing={ 1 }>
          <Grid item xs={ 12 }>
            <Typography variant='h4' className={ classes.title }>
              <FormattedMessage id='preferences.title' defaultMessage='Settings' />
            </Typography>
          </Grid>
          <Grid item xs={ 5 } style={ { marginBottom: 20, margintTop: 40 } }>
            <Typography color='primary' variant='h5' gutterBottom>
              <FormattedMessage id='preferences.actions.language.title' defaultMessage='Language' />
            </Typography>
            <Button
              id='chooseLanguageButton'
              onClick={ this.handleMenu }
              variant='contained'
              size='medium'
              color='primary'
            >
              { language ? (
                <div style={ { display: 'flex', alignItems: 'center' } }>
                  <StyledAvatarIconOnly
                    alt={ `${language}` }
                    src={ language === 'en' ? logoLangEn : logoLangBr }
                    style={ { marginLeft: 0 } }
                  />
                  <strong style={ { marginLeft: 10 } }>
                    { language === 'en' ? 'English' : 'Português' }
                  </strong>
                </div>
              ) : (
                <div>
                  <LanguageIcon />
                  <LabelButton>
                    <FormattedMessage id='preferences.actions.choose.language' defaultMessage='Choose language' />
                  </LabelButton>
                </div>
              ) }
            </Button>

            <Menu
              id='menu-appbar'
              anchorEl={ anchorEl }
              anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
              transformOrigin={ { vertical: 'top', horizontal: 'right' } }
              open={ anchorEl && anchorEl.id === 'chooseLanguageButton' }
              onClose={ this.handleClose }
            >
              <MenuItem onClick={ (e) => this.handleLanguageClick('en') }>
                <StyledAvatarIconOnly
                  alt='English'
                  src={ logoLangEn }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>English</strong>
              </MenuItem>
              <MenuItem onClick={ (e) => this.handleLanguageClick('br') } >
                <StyledAvatarIconOnly
                  alt='Português'
                  src={ logoLangBr }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>Português</strong>
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={ 12 } style={ { marginTop: 20, marginBottom: 20 } }>
            <Typography color='primary' variant='h5'>
              <FormattedMessage id='prefences.my.notifications' defaultMessage='Notifications' />
            </Typography>
            <Switch
              id='switch_receive_notifications'
              checked={ this.state.receiveNotifications }
              onChange={ this.handleHiddenChange }
              value='hidden'
              color='primary'
            />
            &nbsp;
            <label htmlFor='switch_receive_notifications'>
              <Typography component='span' style={ { display: 'inline-block' } } color='default' variant='body2'>
                <FormattedMessage id='preferences.notifications.checkbox' defaultMessage="I want to receive notifications about all the tasks, not just the ones I'm interested" />
              </Typography>
            </label>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default injectIntl(withRouter(withStyles(styles)(Settings)))
