import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import useUserTypes from '../../../../../hooks/use-user-types'

const AccountTabs = ({ user, children }) => {
  const { isContributor } = useUserTypes({ user })
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
          <Tab
            label={<FormattedMessage id="profile.account.tab.roles" defaultMessage="Roles" />}
            value="roles"
          />
          {isContributor && (
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
