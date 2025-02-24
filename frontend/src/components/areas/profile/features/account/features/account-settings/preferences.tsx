import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  Checkbox,
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import Skill from '../account-skills/skill'
import MySkill from '../account-skills/my-skill'

const skills = [
  'Node.js', 'Ruby', 'Python', 'CSS', 'Design', 'Writing', 'Documentation',
  'React', 'React Native', 'Angular', 'Vue.js', 'Blogging', 'Wordpress',
  'PHP', 'Testing', 'Git', 'Continuous Integration'
]

const styles = theme => ({
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  }
})

const Preferences = (props) => {
  const { classes } = props

  const [selectedSkills, setSelectedSkills] = useState(props.preferences.skills ? props.preferences.skills.split(',') : [])
  const [selectedOS, setSelectedOS] = useState(props.preferences.os ? props.preferences.os.split(',') : [])
  const [selectedLanguage, setSelectedLanguage] = useState(props.preferences.language || null)
  const [receiveNotifications, setReceiveNotifications] = useState(props.preferences.receiveNotifications || false)

  useEffect(() => {
    handleSave()
  }, [selectedSkills, selectedOS, receiveNotifications])

  useEffect(() => {
    handleSave(true)
  }, [selectedLanguage])

  const handleSkillClick = (item) => {
    setSelectedSkills(prevSkills => {
      if (prevSkills.includes(item)) {
        return prevSkills.filter(skill => skill !== item)
      } else {
        return [...prevSkills, item]
      }
    })
  }

  const handleOSClick = (item) => {
    setSelectedOS(prevOS => {
      if (prevOS.includes(item)) {
        return prevOS.filter(os => os !== item)
      } else {
        return [...prevOS, item]
      }
    })
  }

  const handleSave = async (fetchPreferences = false) => {
    props.preferences.skills = selectedSkills.join(',')
    props.preferences.os = selectedOS.join(',')
    props.preferences.receiveNotifications = receiveNotifications

    await props.updateUser(props.user.id, {
      skills: selectedSkills.join(','),
      os: selectedOS.join(','),
      language: selectedLanguage,
      receiveNotifications: receiveNotifications
    })
  }

  const listSkills = skills.map(item => (
    <Skill
      key={item}
      classes={classes}
      title={item}
      onClick={() => handleSkillClick(item)}
      isSelected={selectedSkills.includes(item)}
    />
  ))

  const selectedSkillsList = selectedSkills.map(item => (
    <MySkill
      key={item}
      classes={classes}
      title={item}
      onDelete={() => handleSkillClick(item)}
    />
  ))

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <Grid container alignItems='center' spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h5' className={classes.title} gutterBottom>
            <FormattedMessage id='preferences.title.main' defaultMessage='Preferences' />
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography color='primary' variant='h5'>
            <FormattedMessage id='preferences.os' defaultMessage='OS' />
          </Typography>
          <Checkbox id='checkbox_windows' checked={selectedOS.includes('Windows')} onClick={() => handleOSClick('Windows')} />
          <label htmlFor='checkbox_windows'>
            <Typography style={{ display: 'inline-block' }} component='span' color='primary' variant='body2'>
              Windows
            </Typography>
          </label>
          <Checkbox id='checkbox_linux' checked={selectedOS.includes('Linux')} onClick={() => handleOSClick('Linux')} />
          <label htmlFor='checkbox_linux'>
            <Typography style={{ display: 'inline-block' }} component='span' color='primary' variant='body2'>
              Linux
            </Typography>
          </label>
          <Checkbox id='checkbox_mac' checked={selectedOS.includes('Mac')} onClick={() => handleOSClick('Mac')} />
          <label htmlFor='checkbox_mac'>
            <Typography style={{ display: 'inline-block' }} component='span' color='primary' variant='body2'>
              Mac
            </Typography>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Typography color='primary' variant='h5'>
            <FormattedMessage id='prefences.header.title' defaultMessage='Preferences' />
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: 10 }}>
          <Grid container xs={12} style={{ padding: 10 }}>
            {listSkills}
          </Grid>
        </Grid>
        <div style={{ width: '100%', flex: 'auto', display: 'flex', marginTop: 20 }}>
          <Grid item xs={12}>
            <Typography color='primary' variant='h5'>
              <FormattedMessage id='prefences.header.sub' defaultMessage='My language preferences' />
            </Typography>
            <Grid container xs={12} style={{ padding: 10 }}>
              <div className={classes.chipContainer}>
                {selectedSkillsList.length ? (
                  selectedSkillsList
                ) : (
                  <Typography color='textSecondary' variant='body2'>
                    <FormattedMessage id='prefences.my.skills.zero' defaultMessage='No skills selected' />
                  </Typography>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Paper>
  )
}

export const PreferencesPure = Preferences
export default withStyles(styles)(Preferences)
