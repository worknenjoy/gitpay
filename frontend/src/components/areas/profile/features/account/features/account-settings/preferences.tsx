import React from 'react'
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

const skillsList = [
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
  const { classes, preferences, updateUser, user } = props
  const { skills, os } = preferences

  const skillsArray = skills !== '' ? skills?.split(',') : []
  const osArray = os!== '' ? os?.split(',') : []

  const handleSkillClick = async (item) => {
    const updatedSkills = skillsArray?.find(skill => skill === item)?.length > 0
      ? skillsArray?.filter(skill => skill !== item)
      : [...skillsArray, item]
    await updateUser(user.id, { ...preferences, skills: updatedSkills.join(',') })
  }

  const handleOSClick = async (item) => {
    const updatedOS = osArray?.includes(item)
      ? osArray.filter(os => os !== item)
      : [...osArray, item]
    await updateUser(user.id, { ...preferences, os: updatedOS.join(',') })
  }

  const listSkills = skillsList.map((item, index) => (
    <Skill
      key={`skill-${index}`}
      classes={classes}
      title={item}
      onClick={() => handleSkillClick(item)}
      isSelected={skills?.includes(item)}
    />
  ))

  const selectedSkillsList = skillsArray?.map((item, index) => (
    <MySkill
      key={`myskill-${index}`}
      classes={classes}
      title={item}
      onDelete={() => handleSkillClick(item)}
    />
  ))

  const hasSomeSkill = skillsArray?.length > 0

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
          <Checkbox id='checkbox_windows' checked={osArray?.includes('Windows')} onClick={() => handleOSClick('Windows')} />
          <label htmlFor='checkbox_windows'>
            <Typography style={{ display: 'inline-block' }} component='span' color='primary' variant='body2'>
              Windows
            </Typography>
          </label>
          <Checkbox id='checkbox_linux' checked={osArray?.includes('Linux')} onClick={() => handleOSClick('Linux')} />
          <label htmlFor='checkbox_linux'>
            <Typography style={{ display: 'inline-block' }} component='span' color='primary' variant='body2'>
              Linux
            </Typography>
          </label>
          <Checkbox id='checkbox_mac' checked={osArray?.includes('Mac')} onClick={() => handleOSClick('Mac')} />
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
                {hasSomeSkill ? (
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
