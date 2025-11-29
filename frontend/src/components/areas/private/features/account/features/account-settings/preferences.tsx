import React from 'react'
import { Grid, Typography, Checkbox } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Skill from '../account-skills/skill'
import MySkill from '../account-skills/my-skill'
import { Root, Title, ChipContainer, InlineLabel, SkillsGrid, Section, SectionContent } from './preferences.styles'

const skillsList = [
  'Node.js',
  'Ruby',
  'Python',
  'CSS',
  'Design',
  'Writing',
  'Documentation',
  'React',
  'React Native',
  'Angular',
  'Vue.js',
  'Blogging',
  'Wordpress',
  'PHP',
  'Testing',
  'Git',
  'Continuous Integration'
]

const Preferences = (props) => {
  const { classes, preferences, updateUser, user } = props
  const { skills, os } = preferences

  const skillsArray = typeof skills === 'string' && skills.trim() !== '' ? skills.split(',') : []
  const osArray = typeof os === 'string' && os.trim() !== '' ? os.split(',') : []

  const handleSkillClick = async (item) => {
    const updatedSkills = skillsArray?.some((skill) => skill === item)
      ? skillsArray?.filter((skill) => skill !== item)
      : [...skillsArray, item]
    await updateUser({ skills: updatedSkills?.join(',') })
  }

  const handleOSClick = async (item) => {
    const updatedOS = osArray?.includes(item)
      ? osArray.filter((os) => os !== item)
      : [...osArray, item]
    await updateUser({ os: updatedOS?.join(',') })
  }

  const listSkills = skillsList.map((item, index) => (
    <Skill
      key={`skill-${index}`}
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
    <Root elevation={1}>
      <Grid container alignItems="center" spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Title variant="h5" gutterBottom>
            <FormattedMessage id="preferences.title.main" defaultMessage="Preferences" />
          </Title>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography color="primary" variant="h5" gutterBottom>
            <FormattedMessage id="preferences.os" defaultMessage="OS" />
          </Typography>
        </Grid>
        <SectionContent size={{ xs: 12 }}>
          <span>
            <Checkbox
              id="checkbox_windows"
              checked={osArray?.includes('Windows')}
              onClick={() => handleOSClick('Windows')}
            />

            <label htmlFor="checkbox_windows">
              <InlineLabel color="primary" variant="body2">
                Windows
              </InlineLabel>
            </label>
          </span>
          <span>
            <Checkbox
              id="checkbox_linux"
              checked={osArray?.includes('Linux')}
              onClick={() => handleOSClick('Linux')}
            />
            <label htmlFor="checkbox_linux">
              <InlineLabel color="primary" variant="body2">
                Linux
              </InlineLabel>
            </label>
          </span>
          <span>
            <Checkbox
              id="checkbox_mac"
              checked={osArray?.includes('Mac')}
              onClick={() => handleOSClick('Mac')}
            />
            <label htmlFor="checkbox_mac">
              <InlineLabel color="primary" variant="body2">
                Mac
              </InlineLabel>
            </label>
          </span>
        </SectionContent>
        <Grid size={{ xs: 12 }}>
          <Typography color="primary" variant="h5">
            <FormattedMessage id="prefences.header.title" defaultMessage="Preferences" />
          </Typography>
        </Grid>
        <SkillsGrid size={{ xs: 12 }} wrap="wrap">
          <Grid container wrap="wrap" spacing={2}>
            {listSkills}
          </Grid>
        </SkillsGrid>
        <Section>
          <Grid size={{ xs: 12 }}>
            <Typography color="primary" variant="h5">
              <FormattedMessage
                id="prefences.header.sub"
                defaultMessage="My language preferences"
              />
            </Typography>
            <Grid container size={{ xs: 12 }} style={{ padding: 10 }}>
              <ChipContainer>
                {hasSomeSkill ? (
                  selectedSkillsList
                ) : (
                  <Typography color="textSecondary" variant="body2">
                    <FormattedMessage
                      id="prefences.my.skills.zero"
                      defaultMessage="No skills selected"
                    />
                  </Typography>
                )}
              </ChipContainer>
            </Grid>
          </Grid>
        </Section>
      </Grid>
    </Root>
  )
}

export const PreferencesPure = Preferences
export default Preferences
