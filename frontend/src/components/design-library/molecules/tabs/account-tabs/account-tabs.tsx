import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

const AccountTabs = ({ user, children }) => {
  const history = useHistory()
  const [value, setValue] = React.useState('account')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          scrollButtons="auto"
          variant="scrollable"
        >
          <Tab
            label={
              <FormattedMessage
                id="profile.account.tab.login"
                defaultMessage="Login and account details"
              />
            }
            value={'account'}
          />
          {(user?.Types?.map((u) => u.name)?.includes('maintainer') ||
            user?.Types?.map((u) => u.name)?.includes('sponsor')) && (
            <Tab
              label={
                <FormattedMessage
                  id="profile.account.tab.customer"
                  defaultMessage="Billing details"
                />
              }
              value={'customer'}
            />
          )}
          <Tab
            label={<FormattedMessage id="profile.account.tab.roles" defaultMessage="Roles" />}
            value="roles"
          />
          {user?.Types?.map((u) => u.name)?.includes('contributor') && (
            <Tab
              label={<FormattedMessage id="profile.account.tab.skills" defaultMessage="Skills" />}
              value="skills"
            />
          )}
          <Tab
            label={<FormattedMessage id="profile.account.tab.settings" defaultMessage="Settings" />}
            value="settings"
          />
        </Tabs>
      </Box>
      <Box sx={{ p: 2, pl: 0 }}>{children}</Box>
    </Box>
  )
}

export default AccountTabs
