import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Checkbox,
  Switch,
  Menu,
  MenuItem,
  Button
} from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'

import { LabelButton, StyledAvatarIconOnly } from '../topbar/TopbarStyles'

import { FormattedMessage, injectIntl } from 'react-intl'
import Skill from './skill'
import MySkill from './my-skill'

const skills = [
  'Node.js', 'Ruby', 'Python', 'CSS', 'Design', 'Writing', 'Documentation', 'React', 'React Native', 'Angular', 'Vue.js', 'Blogging', 'Wordpress', 'PHP', 'Testing', 'Git', 'Continuous Integration'
]

const logoLangEn = require('../../images/united-states-of-america.png')
const logoLangBr = require('../../images/brazil.png')

const styles = theme => ({

})

class Preferences extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedSkills: this.props.preferences.skills != null && this.props.preferences.skills.length > 0 ? this.props.preferences.skills.split(',') : [],
      selectedOS: this.props.preferences.os ? this.props.preferences.os.split(',') : [],
      selectedLanguage: this.props.preferences.language ? this.props.preferences.language : null,
      receiveNotifications: this.props.preferences.receiveNotifications != null ? this.props.preferences.receiveNotifications : false,
      openForJobs: this.props.preferences.openForJobs != null ? this.props.preferences.openForJobs : false,
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.preferences.skills !== prevState.selectedSkills.toString() ||
      prevProps.preferences.os !== prevState.selectedOS.toString() ||
      prevProps.preferences.receiveNotifications !== this.state.receiveNotifications ||
      prevProps.preferences.openForJobs !== this.state.openForJobs
    ) {
      this.handleSave()
    }
    else if (
      prevState.selectedLanguage !== this.state.selectedLanguage
    ) {
      this.handleSave(true)
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
  handleJobsCheck = (event, hidden) => {
    this.setState(state => ({
      'openForJobs': !this.state.openForJobs,
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

  handleLanguageClick = (lang) => {
    this.setState({ selectedLanguage: lang, anchorEl: null })
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
      selectedLanguage: this.props.preferences.language ? this.props.preferences.language : null,
      receiveNotifications: this.props.preferences.receiveNotifications != null ? this.props.preferences.receiveNotifications : false,
    })
  }

  handleSave = (fetchPreferences = false) => {
    // prevent blink
    this.props.preferences.skills = this.state.selectedSkills.join(',')
    this.props.preferences.os = this.state.selectedOS.join(',')
    this.props.preferences.receiveNotifications = this.state.receiveNotifications
    this.props.preferences.openForJobs = this.state.openForJobs

    this.props.updateUser(this.props.user.id, {
      skills: this.state.selectedSkills.join(','),
      os: this.state.selectedOS.join(','),
      language: this.state.selectedLanguage,
      receiveNotifications: this.state.receiveNotifications,
      openForJobs: this.state.openForJobs
    }).then(() => {
      fetchPreferences && this.props.fetchPreferences(this.props.user.id)
    })
  }

  render () {
    const { classes } = this.props

    let instance = this
    const anchorEl = this.state.anchorEl
    const language = this.state.selectedLanguage

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

    return (
      <Paper elevation={ 0 }>
        <Grid container alignItems='center' spacing={ 1 }>
          <Grid item xs={ 5 } style={ { marginBottom: 20 } }>
            <Typography color='primary' variant='title' gutterBottom>
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
          <Grid item xs={ 7 } >
            <Typography color='primary' variant='title'>
              <FormattedMessage id='preferences.os' defaultMessage='OS' />
            </Typography>
            <Checkbox id='checkbox_windows' checked={ this.isOSSelected('Windows') } onClick={ () => this.handleOSClick('Windows') } />
            <label htmlFor='checkbox_windows'>
              <Typography style={ { display: 'inline-block' } } component='span' color='default' variant='body2'>
                Windows
              </Typography>
            </label>
            <Checkbox id='checkbox_linux' checked={ this.isOSSelected('Linux') } onClick={ () => this.handleOSClick('Linux') } />
            <label htmlFor='checkbox_linux'>
              <Typography style={ { display: 'inline-block' } } component='span' color='default' variant='body2'>
                Linux
              </Typography>
            </label>
            <Checkbox id='checkbox_mac' checked={ this.isOSSelected('Mac') } onClick={ () => this.handleOSClick('Mac') } />
            <label htmlFor='checkbox_mac'>
              <Typography style={ { display: 'inline-block' } } component='span' color='default' variant='body2'>
                Mac
              </Typography>
            </label>
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
          <div style={ { 'width': '100%', 'flex': 'auto', 'display': 'flex', marginTop: 20 } }>
            <Grid item xs={ 12 }>
              <Typography color='primary' variant='title'>
                <FormattedMessage id='prefences.my.skills' defaultMessage='My Skills' />
              </Typography>
              <Grid container xs={ 12 } style={ { padding: 10 } }>
                <div className={ classes.chipContainer }>
                  { selectedSkills.length ? (
                    selectedSkills
                  ) : (
                    <Typography color='textSecondary' variant='body2'>
                      <FormattedMessage id='prefences.my.skills.zero' defaultMessage='No skills selected' />
                    </Typography>
                  ) }
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid item xs={ 12 } style={ { marginTop: 20, marginBottom: 20 } }>
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
            &nbsp;
            <label htmlFor='switch_receive_notifications'>
              <Typography component='span' style={ { display: 'inline-block' } } color='default' variant='body2'>
                <FormattedMessage id='preferences.notifications.checkbox' defaultMessage="I want to receive notifications about all the tasks, not just the ones I'm interested" />
              </Typography>
            </label>
          </Grid>
          <Grid item xs={ 12 } style={ { marginTop: 20, marginBottom: 20 } }>
            <Typography color='primary' variant='title'>
              <FormattedMessage id='prefences.my.openforjobs' defaultMessage='Open For Jobs' />
            </Typography>
            <Checkbox
              onClick={ this.handleJobsCheck }
              checked={ this.state.openForJobs ? 'checked' : '' } />
            &nbsp;
            <label htmlFor='check_open_for_jobs'>
              <Typography component='span' style={ { display: 'inline-block' } } color='default' variant='body2'>
                <FormattedMessage id='preferences.jobs.checkbox' defaultMessage='Are you open for job opportunities?' />
              </Typography>
            </label>
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
export default injectIntl(withRouter(withStyles(styles)(Preferences)))
