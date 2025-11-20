// .storybook/decorators/withProfileTemplate.tsx
import React from 'react'
import PrivateBase from '../../src/components/design-library/templates/base/private-base/private-base'
import PayoutSettings from '../../src/components/design-library/pages/private-pages/settings-pages/payout-settings/payout-settings'
import PayoutSettingsBankAccount from '../../src/components/design-library/pages/private-pages/settings-pages/payout-settings-bank-account/payout-settings-bank-account'

export const withProfileTemplate = (Story: any, context: any) => {
  const { user, profileHeaderProps, onResendActivationEmail } = context.args

  return (
    <PrivateBase
      createTask={() => {}}
      signOut={() => {}}
      user={user}
      profileHeaderProps={profileHeaderProps}
      onResendActivationEmail={onResendActivationEmail}
    >
      <Story />
    </PrivateBase>
  )
}

export const withProfilePayoutSettingsTemplate = (Story: any, context: any) => {
  return (
    <PayoutSettings>
      <Story />
    </PayoutSettings>
  )
}

export const withProfilePayoutSettingsBankAccountTemplate = (Story: any, context: any) => {
  const { user } = context.args

  return (
    <PayoutSettingsBankAccount user={user} onSaveCountry={() => {}}>
      <Story />
    </PayoutSettingsBankAccount>
  )
}
