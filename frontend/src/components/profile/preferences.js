import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Checkbox,
} from '@material-ui/core'

import { FormattedMessage, injectIntl } from 'react-intl'
import Skill from './skill'
import MySkill from './my-skill'

const skills = [
  'Node.js', 'Ruby', 'Python', 'CSS', 'Design', 'Writing', 'Documentation', 'React', 'React Native', 'Angular', 'Vue.js', 'Blogging', 'Wordpress', 'PHP', 'Testing', 'Git', 'Continuous Integration'
]

const styles = theme => ({
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  }
})

class Preferences extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedSkills: this.props.preferences.skills != null && this.props.preferences.skills.length > 0 ? this.props.preferences.skills.split(',') : [],
      selectedOS: this.props.preferences.os ? this.props.preferences.os.split(',') : [],
      selectedLanguage: this.props.preferences.language ? this.props.preferences.language : null,
      receiveNotifications: this.props.preferences.receiveNotifications != null ? this.props.preferences.receiveNotifications : false
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.preferences.skills !== prevState.selectedSkills.toString() ||
      prevProps.preferences.os !== prevState.selectedOS.toString() ||
      prevProps.preferences.receiveNotifications !== this.state.receiveNotifications
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

  handleSave = async (fetchPreferences = false) => {
    // prevent blink
    this.props.preferences.skills = this.state.selectedSkills.join(',')
    this.props.preferences.os = this.state.selectedOS.join(',')
    this.props.preferences.receiveNotifications = this.state.receiveNotifications

    await this.props.updateUser(this.props.user.id, {
      skills: this.state.selectedSkills.join(','),
      os: this.state.selectedOS.join(','),
      language: this.state.selectedLanguage,
      receiveNotifications: this.state.receiveNotifications
    })
  }

  render () {
    const { classes } = this.props

    let instance = this

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
      <Paper elevation={ 1 } style={ { padding: 20 } }>
        <Grid container alignItems='center' spacing={ 1 }>
          <Grid item xs={ 12 }>
            <Typography variant='h5' className={ classes.title } gutterBottom>
              <FormattedMessage id='preferences.title.main' defaultMessage='Preferences' />
            </Typography>
          </Grid>
          <Grid item xs={ 7 } >
            <Typography color='primary' variant='h5'>
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
            <Typography color='primary' variant='h5'>
              <FormattedMessage id='prefences.header.title' defaultMessage='Preferences' />
            </Typography>
          </Grid>
          <Grid item xs={ 12 } style={ { marginBottom: 10 } }>
            <Grid container xs={ 12 } style={ { padding: 10 } }>
              { listSkills }
            </Grid>
          </Grid>
          <div style={ { 'width': '100%', 'flex': 'auto', 'display': 'flex', marginTop: 20 } }>
            <Grid item xs={ 12 }>
              <Typography color='primary' variant='h5'>
                <FormattedMessage id='prefences.header.sub' defaultMessage='My language preferences' />
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
