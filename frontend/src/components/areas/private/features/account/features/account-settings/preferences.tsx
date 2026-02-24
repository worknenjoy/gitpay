import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Skill from '../account-skills/skill'
import MySkill from '../account-skills/my-skill'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import PreferenceRow from 'design-library/molecules/lists/preference-row/preference-row'
import OsSwitcher from 'design-library/molecules/switchers/os-switcher/os-switcher'

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

const allowedOs = ['Windows', 'Linux', 'Mac'] as const
type AllowedOs = (typeof allowedOs)[number]

const parseCsv = (value?: unknown) => {
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  return trimmed
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

const normalizeKey = (values: string[]) => {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)))
    .sort()
    .join(',')
}

const Skills = (props) => {
  const { preferences, updateUser } = props
  const { data } = preferences || {}
  const { skills, os } = data || {}

  const hasUserEditedRef = useRef(false)
  const [saving, setSaving] = useState(false)

  const serverSkills = useMemo(() => parseCsv(skills), [skills])
  const serverOs = useMemo(() => {
    return parseCsv(os).filter((value): value is AllowedOs =>
      (allowedOs as readonly string[]).includes(value)
    )
  }, [os])

  const [savedSnapshot, setSavedSnapshot] = useState({
    skillsKey: normalizeKey(serverSkills),
    osKey: normalizeKey(serverOs)
  })

  const [draftSkills, setDraftSkills] = useState<string[]>(serverSkills)
  const [draftOs, setDraftOs] = useState<AllowedOs[]>(serverOs)

  useEffect(() => {
    if (hasUserEditedRef.current) return

    setSavedSnapshot({
      skillsKey: normalizeKey(serverSkills),
      osKey: normalizeKey(serverOs)
    })
    setDraftSkills(serverSkills)
    setDraftOs(serverOs)
  }, [serverSkills, serverOs])

  const isDirty = useMemo(() => {
    return (
      normalizeKey(draftSkills) !== savedSnapshot.skillsKey ||
      normalizeKey(draftOs) !== savedSnapshot.osKey
    )
  }, [draftOs, draftSkills, savedSnapshot.osKey, savedSnapshot.skillsKey])

  const toggleDraftSkill = (item: string) => {
    hasUserEditedRef.current = true
    setDraftSkills((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    )
  }

  const handleDraftOsChange = (values: AllowedOs[]) => {
    hasUserEditedRef.current = true
    setDraftOs(values)
  }

  const handleSave = async () => {
    if (!isDirty || saving) return

    const payload: Record<string, unknown> = {}
    const nextSkillsKey = normalizeKey(draftSkills)
    const nextOsKey = normalizeKey(draftOs)
    if (nextSkillsKey !== savedSnapshot.skillsKey) payload.skills = draftSkills.join(',')
    if (nextOsKey !== savedSnapshot.osKey) payload.os = draftOs.join(',')

    setSaving(true)
    try {
      await updateUser(payload)
      setSavedSnapshot({ skillsKey: nextSkillsKey, osKey: nextOsKey })
      hasUserEditedRef.current = false
    } catch (e) {
      console.log('error', e)
    } finally {
      setSaving(false)
    }
  }

  const listSkills = skillsList.map((item, index) => (
    <Skill
      key={`skill-${index}`}
      title={item}
      onClick={() => toggleDraftSkill(item)}
      isSelected={draftSkills.includes(item)}
    />
  ))

  const hasSomeSkill = draftSkills.length > 0
  const selectedSkillsList = draftSkills.map((item, index) => (
    <MySkill key={`myskill-${index}`} title={item} onDelete={() => toggleDraftSkill(item)} />
  ))

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MainTitle
          title={<FormattedMessage id="profile.account.tab.skills" defaultMessage="Skills" />}
          subtitle={
            <FormattedMessage
              id="profile.skills.subtitle"
              defaultMessage="Select your skills and preferences"
            />
          }
        />

        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            <FormattedMessage id="preferences.os" defaultMessage="OS" />
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <PreferenceRow
              title={<FormattedMessage id="skills.os.title" defaultMessage="Preferred OS" />}
              description={
                <FormattedMessage
                  id="skills.os.subtitle"
                  defaultMessage="Choose your preferable OS"
                />
              }
              action={
                <OsSwitcher multiple value={draftOs} onChange={handleDraftOsChange} size="medium" />
              }
            />
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            <FormattedMessage id="profile.account.tab.skills" defaultMessage="Skills" />
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ px: 2.5, py: 2 }}>
              <Grid container wrap="wrap" spacing={2}>
                {listSkills}
              </Grid>
            </Box>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            <FormattedMessage id="profile.skills.selected" defaultMessage="Selected skills" />
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ px: 2.5, py: 2 }}>
              {hasSomeSkill ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{selectedSkillsList}</Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="prefences.my.skills.zero"
                    defaultMessage="No skills selected"
                  />
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!isDirty || saving}
          >
            {saving ? (
              'Saving…'
            ) : (
              <FormattedMessage id="preferences.actions.save" defaultMessage="Save settings" />
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export const SkillsPure = Skills
export default Skills
