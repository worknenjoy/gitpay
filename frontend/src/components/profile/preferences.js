import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'

import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { LabelButton, StyledButton, StyledAvatarIconOnly } from '../topbar/TopbarStyles'
import LanguageIcon from 'material-ui-icons/ViewList'
import { Checkbox, Switch, Menu, MenuItem, Button } from 'material-ui'
import Skill from './skill'
import MySkill from './my-skill'
import MyLanguage from './my-language'

const skills = [
  'Node.js', 'Writing', 'React', 'Blogging', 'Wordpress', 'Testing',
]

const logoLangEn = require('../../images/united-states-of-america.png')
const logoLangBr = require('../../images/brazil.png')

class Preferences extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedSkills: this.props.preferences.skills != null && this.props.preferences.skills.length > 0 ? this.props.preferences.skills.split(',') : [],
      selectedOS: this.props.preferences.os != null && this.props.preferences.skills.length > 0 ? this.props.preferences.os.split(',') : [],
      selectedLanguages: this.props.preferences.languages != null && this.props.preferences.languages.length > 0 ? this.props.preferences.languages.split(',') : [],
      receiveNotifications: this.props.preferences.receiveNotifications != null ? this.props.preferences.receiveNotifications : false,
    }
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleHiddenChange = (event, hidden) => {
    this.setState(state => ({
      'receiveNotifications': !this.state.receiveNotifications,
    }))
  }

  handleSkillClick = (item) => {
    let data = this.state.selectedSkills

    if (!this.isSkillSelected(item)) {
      data.push(item)
    }
    else {
      data.splice(data.indexOf(item), 1)
    }

    this.setState({
      selectedSkills: data
    })
  }

  isSkillSelected = (item) => {
    return this.state.selectedSkills.indexOf(item) > -1
  }

  handleRemoveSkill = (item) => {
    if (this.isSkillSelected(item)) {
      this.handleSkillClick(item)
    }
  }

  handleLanguageClick = (item) => {
    let data = this.state.selectedLanguages

    if (!this.isLanguageSelected(item)) {
      data.push(item)
    }
    else {
      data.splice(data.indexOf(item), 1)
    }

    this.setState({
      selectedLanguages: data,
      anchorEl: null
    })
  }

  isLanguageSelected = (item) => {
    return this.state.selectedLanguages.indexOf(item) > -1
  }

  handleRemoveLanguage = (item) => {
    if (this.isLanguageSelected(item)) {
      this.handleLanguageClick(item)
    }
  }

  isOSSelected = (item) => {
    return this.state.selectedOS.indexOf(item) > -1
  }

  handleOSClick = (item) => {
    let data = this.state.selectedOS

    if (!this.isOSSelected(item)) {
      data.push(item)
    }
    else {
      data.splice(data.indexOf(item), 1)
    }

    this.setState({
      selectedOS: data
    })
  }

  handleCancel = () => {
    this.reloadPreferences()
  }

  reloadPreferences = () => {
    this.setState({
      selectedSkills: this.props.preferences.skills != null && this.props.preferences.skills.length > 0 ? this.props.preferences.skills.split(',') : [],
      selectedOS: this.props.preferences.os != null && this.props.preferences.skills.length > 0 ? this.props.preferences.os.split(',') : [],
      selectedLanguages: this.props.preferences.languages != null && this.props.preferences.languages.length > 0 ? this.props.preferences.languages.split(',') : [],
      receiveNotifications: this.props.preferences.receiveNotifications != null ? this.props.preferences.receiveNotifications : false,
    })
  }

  handleSave = () => {
    // prevent blink
    this.props.preferences.skills = this.state.selectedSkills.join(',')
    this.props.preferences.os = this.state.selectedOS.join(',')
    this.props.preferences.languages = this.state.selectedLanguages.join(',')
    this.props.preferences.receiveNotifications = this.state.receiveNotifications

    this.props.updateUser(this.props.user.id, {
      skills: this.state.selectedSkills.join(','),
      os: this.state.selectedOS.join(','),
      languages: this.state.selectedLanguages.join(','),
      receiveNotifications: this.state.receiveNotifications
    }).then(() => {
      this.props.fetchPreferences(this.props.user.id)
    })
  }

  render () {
    const { classes } = this.props

    let instance = this
    const anchorEl = this.state.anchorEl
    let listSkills = skills.map(function (item) {
      return (
        <Skill classes={ classes } title={ item } onClick={ () => instance.handleSkillClick(item) } isSelected={ instance.isSkillSelected(item) } />
      )
    })

    let selectedSkills = this.state.selectedSkills.map(function (item) {
      return (
        <MySkill classes={ classes } title={ item } onDelete={ () => instance.handleRemoveSkill(item) } />
      )
    })

    let selectedLanguages = this.state.selectedLanguages.map(function (item) {
      return (
        <MyLanguage classes={ classes } title={ item } onDelete={ () => instance.handleRemoveLanguage(item) } />
      )
    })

    return (
      <Paper elevation={ 0 }>
        <Grid container alignItems='center' spacing={ 8 }>
          <Grid item xs={ 5 } style={ { padding: 10 } }>
            <Typography color='primary' variant='title'>
                Language
            </Typography>

            <StyledButton
              id='chooseLanguageButton'
              onClick={ this.handleMenu }
              variant='raised'
              size='medium'
              color='primary'
            >
              <LanguageIcon />
              <LabelButton>
                <FormattedMessage id='preferences.actions.choose.language' defaultMessage='Choose language' />
              </LabelButton>
            </StyledButton>

            <Menu
              id='menu-appbar'
              anchorEl={ anchorEl }
              anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
              transformOrigin={ { vertical: 'top', horizontal: 'right' } }
              open={ anchorEl && anchorEl.id === 'chooseLanguageButton' }
              onClose={ this.handleClose }
            >
              <MenuItem onClick={ (e) => this.handleLanguageClick('English') }>
                <StyledAvatarIconOnly
                  alt='English'
                  src={ logoLangEn }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>English</strong>
              </MenuItem>
              <MenuItem onClick={ (e) => this.handleLanguageClick('Português') } >
                <StyledAvatarIconOnly
                  alt='Português'
                  src={ logoLangBr }
                />
                <strong style={ { display: 'inline-block', margin: 10 } }>Português</strong>
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={ 7 } >
            <Typography color='primary' variant='title'>
              <FormattedMessage id='preferences.os' defaultMessage='OS' />
            </Typography>
            <Checkbox id='checkbox_windows' checked={ this.isOSSelected('Windows') } onClick={ () => this.handleOSClick('Windows') } /><label htmlFor='checkbox_windows'>Windows</label>
            <Checkbox id='checkbox_linux' checked={ this.isOSSelected('Linux') } onClick={ () => this.handleOSClick('Linux') } /><label htmlFor='checkbox_linux'>Linux</label>
            <Checkbox id='checkbox_mac' checked={ this.isOSSelected('Mac') } onClick={ () => this.handleOSClick('Mac') } /><label htmlFor='checkbox_mac'>Mac</label>
          </Grid>
          <Grid item xs={ 12 }>
            <Typography color='primary' variant='title'>
              <FormattedMessage id='prefences.skills' defaultMessage='Skills' />
            </Typography>
          </Grid>
          <Grid item xs={ 12 } style={ { marginBottom: 10 } }>
            <Grid container xs={ 12 } style={ { padding: 10 } }>
              { listSkills }
            </Grid>
          </Grid>
          <div style={ { 'width': '100%', 'flex': 'auto', 'display': 'flex' } }>
            <Grid item xs={ 6 }>
              <Typography color='primary' variant='title'>
                <FormattedMessage id='prefences.my.skills' defaultMessage='My Skills' />
              </Typography>
              <Grid container xs={ 12 } style={ { padding: 10 } }>
                <div className={ classes.chipContainer }>
                  { selectedSkills }
                </div>
              </Grid>
            </Grid>
            <Grid item xs={ 6 }>
              <Typography color='primary' variant='title'>
                <FormattedMessage id='prefences.my.languages' defaultMessage='Languages' />
              </Typography>
              <Grid container xs={ 12 } style={ { padding: 10 } }>
                <div className={ classes.chipContainer }>
                  { selectedLanguages }
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid item xs={ 12 }>
            <Typography color='primary' variant='title'>
              <FormattedMessage id='prefences.my.notifications' defaultMessage='Notifications' />
            </Typography>

            <Switch
              id='switch_receive_notifications'
              checked={ this.state.receiveNotifications }
              onChange={ this.handleHiddenChange }
              value='hidden'
              color='primary'
            />
            &nbsp;<label htmlFor='switch_receive_notifications'>
              <FormattedMessage id='preferences.notifications.checkbox' defaultMessage="I want to receive notifications about all the tasks, not just the ones I'm interested" />
            </label>
          </Grid>
          <Grid item xs={ 12 } alignContent='center' alignItems='center' style={ { 'textAlign': 'center' } }>
            <Button color='primary' onClick={ () => this.handleCancel() }>
              <FormattedMessage id='general.actions.cancel' defaultMessage='Cancel' />
            </Button>&nbsp;
            <Button
              style={ { color: 'white' } }
              size='large'
              variant='raised'
              color='primary'
              onClick={ () => this.handleSave() }
            >
              <FormattedMessage id='preferences.action.save' defaultMessage='Save' />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

Preferences.PropTypes = {
  classes: PropTypes.object.isRequired,
  preferences: PropTypes.string,
  language: PropTypes.string,
  updateUser: PropTypes.func,
  fetchPreferences: PropTypes.func
}

export const PreferencesPure = Preferences
export default injectIntl(withRouter((Preferences)))
