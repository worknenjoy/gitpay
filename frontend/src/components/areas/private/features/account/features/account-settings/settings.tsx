import React, { useState } from 'react'
import { Typography, Paper, Grid, Menu, MenuItem, Button, Switch, Checkbox } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import { updateIntl } from 'react-intl-redux'
import { FormattedMessage } from 'react-intl'
import { store } from '../../../../../../../main/app'
import messagesBr from '../../../../../../../translations/result/br.json'
import messagesEn from '../../../../../../../translations/result/en.json'
import messagesBrLocal from '../../../../../../../translations/generated/br.json'
import messagesEnLocal from '../../../../../../../translations/generated/en.json'
import { Title, LabelButton, StyledAvatarIconOnly } from './settings.styles'

const messages = {
  br: process.env.NODE_ENV === 'production' ? messagesBr : messagesBrLocal,
  en: process.env.NODE_ENV === 'production' ? messagesEn : messagesEnLocal
}

import logoLangEn from 'images/united-states-of-america.png'
import logoLangBr from 'images/brazil.png'

const Settings = (props) => {
  const { user } = props
  const { data } = user || {}
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [receiveNotifications, setReceiveNotifications] = useState(data.receiveNotifications)
  const [openForJobs, setOpenForJobs] = useState(data.openForJobs)
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLanguageClick = async (lang) => {
    setSelectedLanguage(lang)
    setAnchorEl(null)
    try {
      await props.updateUser({ language: lang })
      localStorage.setItem('userLanguage', lang)
      store.dispatch(
        updateIntl({
          locale: lang,
          messages: messages[lang]
        })
      )
    } catch (e) {
      console.log('error', e)
    }
  }

  const handleHiddenChange = async (event) => {
    setReceiveNotifications(event.currentTarget.checked)
    try {
      await props.updateUser({ receiveNotifications: event.currentTarget.checked })
    } catch (e) {
      console.log('error', e)
    }
  }

  const handleJobsCheck = async () => {
    setOpenForJobs(!openForJobs)
    try {
      await props.updateUser({ openForJobs: !openForJobs })
    } catch (e) {
      console.log('error', e)
    }
  }

  const language = selectedLanguage || user.language

  return (
    <Paper elevation={1} style={{ padding: 20 }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Title variant="h5" gutterBottom>
            <FormattedMessage id="preferences.title" defaultMessage="Settings" />
          </Title>
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }} style={{ marginBottom: 20, marginTop: 40 }}>
          <Typography color="primary" variant="h5" gutterBottom>
            <FormattedMessage id="preferences.actions.language.title" defaultMessage="Language" />
          </Typography>
          <Button
            id="chooseLanguageButton"
            onClick={handleMenu}
            variant="contained"
            size="medium"
            color="primary"
          >
            {language ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StyledAvatarIconOnly
                  alt={`${language}`}
                  src={language === 'en' ? logoLangEn : logoLangBr}
                  style={{ marginLeft: 0 }}
                />
                <strong style={{ marginLeft: 10 }}>
                  {language === 'en' ? 'English' : 'Português'}
                </strong>
              </div>
            ) : (
              <div>
                <LanguageIcon />
                <LabelButton>
                  <FormattedMessage
                    id="preferences.actions.choose.language"
                    defaultMessage="Choose language"
                  />
                </LabelButton>
              </div>
            )}
          </Button>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLanguageClick('en')}>
              <StyledAvatarIconOnly alt="English" src={logoLangEn} />
              <strong style={{ display: 'inline-block', margin: 10 }}>English</strong>
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClick('br')}>
              <StyledAvatarIconOnly alt="Português" src={logoLangBr} />
              <strong style={{ display: 'inline-block', margin: 10 }}>Português</strong>
            </MenuItem>
          </Menu>
        </Grid>
        <Grid size={{ xs: 12 }} style={{ marginTop: 20, marginBottom: 20 }}>
          <Typography color="primary" variant="h5">
            <FormattedMessage id="prefences.my.notifications" defaultMessage="Notifications" />
          </Typography>
          <Switch
            id="switch_receive_notifications"
            checked={receiveNotifications}
            onChange={handleHiddenChange}
            value="hidden"
            color="primary"
          />
          &nbsp;
          <label htmlFor="switch_receive_notifications">
            <Typography
              component="span"
              style={{ display: 'inline-block' }}
              color="primary"
              variant="body2"
            >
              <FormattedMessage
                id="preferences.notifications.receiveNotifications"
                defaultMessage="I want to receive relevant notifications from Gitpay"
              />
            </Typography>
          </label>
        </Grid>
        <Grid size={{ xs: 12 }} style={{ marginTop: 20, marginBottom: 20 }}>
          <Typography color="primary" variant="h5">
            <FormattedMessage id="prefences.my.openforjobs" defaultMessage="Open For Jobs" />
          </Typography>
          <Checkbox onClick={handleJobsCheck} checked={openForJobs} />
          &nbsp;
          <label htmlFor="check_open_for_jobs">
            <Typography
              component="span"
              style={{ display: 'inline-block' }}
              color="primary"
              variant="body2"
            >
              <FormattedMessage
                id="preferences.jobs.checkbox"
                defaultMessage="Are you open for job opportunities?"
              />
            </Typography>
          </label>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Settings
