import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Checkbox, Paper, Switch, Typography } from '@mui/material'
import { updateIntl } from 'react-intl-redux'
import { FormattedMessage } from 'react-intl'
import { store } from '../../../../../../../main/app'
import messagesBr from '../../../../../../../translations/result/br.json'
import messagesEn from '../../../../../../../translations/result/en.json'
import messagesBrLocal from '../../../../../../../translations/generated/br.json'
import messagesEnLocal from '../../../../../../../translations/generated/en.json'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import PreferenceRow from 'design-library/molecules/lists/preference-row/preference-row'
import LanguageSwitcher from 'design-library/molecules/switchers/language-switcher/language-switcher'

const messages = {
  br: process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  en: process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

const applyLanguage = (lang: 'en' | 'br') => {
  localStorage.setItem('userLanguage', lang)
  store.dispatch(
    updateIntl({
      locale: lang,
      messages: messages[lang]
    })
  )
}

const Settings = (props) => {
  const { user } = props
  const { data } = user || {}
  const hasUserEditedRef = useRef(false)
  const [saving, setSaving] = useState(false)

  const serverLanguage =
    (user?.language as 'en' | 'br') || (localStorage.getItem('userLanguage') as 'en' | 'br') || 'en'
  const serverReceiveNotifications = Boolean(user?.data?.receiveNotifications)
  const serverOpenForJobs = Boolean(user?.data?.openForJobs)

  const [savedSnapshot, setSavedSnapshot] = useState({
    language: serverLanguage,
    receiveNotifications: Boolean(data?.receiveNotifications),
    openForJobs: Boolean(data?.openForJobs)
  })

  const [draftLanguage, setDraftLanguage] = useState<'en' | 'br'>(serverLanguage)
  const [draftReceiveNotifications, setDraftReceiveNotifications] = useState(
    Boolean(data?.receiveNotifications)
  )
  const [draftOpenForJobs, setDraftOpenForJobs] = useState(Boolean(data?.openForJobs))

  useEffect(() => {
    if (hasUserEditedRef.current) return

    setSavedSnapshot({
      language: serverLanguage,
      receiveNotifications: serverReceiveNotifications,
      openForJobs: serverOpenForJobs
    })
    setDraftLanguage(serverLanguage)
    setDraftReceiveNotifications(serverReceiveNotifications)
    setDraftOpenForJobs(serverOpenForJobs)
  }, [serverLanguage, serverReceiveNotifications, serverOpenForJobs])

  const isDirty = useMemo(() => {
    return (
      draftLanguage !== savedSnapshot.language ||
      draftReceiveNotifications !== savedSnapshot.receiveNotifications ||
      draftOpenForJobs !== savedSnapshot.openForJobs
    )
  }, [
    draftLanguage,
    draftOpenForJobs,
    draftReceiveNotifications,
    savedSnapshot.language,
    savedSnapshot.openForJobs,
    savedSnapshot.receiveNotifications
  ])

  const handleDraftLanguageChange = async (lang: 'en' | 'br') => {
    hasUserEditedRef.current = true
    setDraftLanguage(lang)

    try {
      await props.updateUser({ language: lang })
      applyLanguage(lang)
      setSavedSnapshot((prev) => ({ ...prev, language: lang }))
      hasUserEditedRef.current = false
    } catch (e) {
      console.log('error', e)
    }
  }

  const handleDraftReceiveNotificationsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    hasUserEditedRef.current = true
    setDraftReceiveNotifications(checked)
  }

  const handleDraftOpenForJobsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    hasUserEditedRef.current = true
    setDraftOpenForJobs(checked)
  }

  const handleSaveSettings = async () => {
    if (!isDirty || saving) return

    const payload: Record<string, unknown> = {}
    if (draftLanguage !== savedSnapshot.language) payload.language = draftLanguage
    if (draftReceiveNotifications !== savedSnapshot.receiveNotifications)
      payload.receiveNotifications = draftReceiveNotifications
    if (draftOpenForJobs !== savedSnapshot.openForJobs) payload.openForJobs = draftOpenForJobs

    setSaving(true)
    try {
      await props.updateUser(payload)

      if (payload.language) {
        applyLanguage(draftLanguage)
      }

      setSavedSnapshot({
        language: draftLanguage,
        receiveNotifications: draftReceiveNotifications,
        openForJobs: draftOpenForJobs
      })

      hasUserEditedRef.current = false
    } catch (e) {
      console.log('error', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MainTitle
          title={<FormattedMessage id="preferences.title" defaultMessage="Settings" />}
          subtitle={
            <FormattedMessage
              id="preferences.subtitle"
              defaultMessage="Manage your preferences and notifications"
            />
          }
        />

        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            <FormattedMessage id="preferences.section.appearance" defaultMessage="Appearance" />
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <PreferenceRow
              title={
                <FormattedMessage
                  id="preferences.actions.language.title"
                  defaultMessage="Language"
                />
              }
              description={
                <FormattedMessage
                  id="preferences.actions.language.subtitle"
                  defaultMessage="Choose your preferred language"
                />
              }
              action={
                <LanguageSwitcher
                  completed={Boolean(user)}
                  onSwitchLang={handleDraftLanguageChange}
                  userCurrentLanguage={draftLanguage}
                  user={user}
                  variant="outlined"
                  size="medium"
                  showLabel
                  showTooltip={false}
                  buttonId="chooseLanguageButton"
                  menuId="menu-appbar"
                />
              }
            />
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            <FormattedMessage id="preferences.section.preferences" defaultMessage="Preferences" />
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
            <PreferenceRow
              title={
                <FormattedMessage
                  id="preferences.notifications.title"
                  defaultMessage="Receive notifications"
                />
              }
              description={
                <FormattedMessage
                  id="preferences.notifications.receiveNotifications"
                  defaultMessage="I want to receive relevant notifications from Gitpay"
                />
              }
              action={
                <Switch
                  id="switch_receive_notifications"
                  checked={draftReceiveNotifications}
                  onChange={handleDraftReceiveNotificationsChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'receive notifications' }}
                />
              }
              divider
            />

            <PreferenceRow
              title={
                <FormattedMessage id="preferences.jobs.title" defaultMessage="Open for jobs" />
              }
              description={
                <FormattedMessage
                  id="preferences.jobs.checkbox"
                  defaultMessage="Are you open for job opportunities?"
                />
              }
              action={
                <Switch
                  id="check_open_for_jobs"
                  checked={draftOpenForJobs}
                  onChange={handleDraftOpenForJobsChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'open for jobs' }}
                />
              }
            />
          </Paper>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
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
      </Box>
    </Paper>
  )
}

export default Settings
