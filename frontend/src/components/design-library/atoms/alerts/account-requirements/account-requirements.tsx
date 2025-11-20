import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Typography } from '@mui/material'
import { validAccount } from '../../../../../utils/valid-account'
import api from '../../../../../consts'
import Button from '../../../atoms/buttons/button/button'
import { CustomAlert } from './account-requirements.styles'

const AccountRequirements = ({ user, account, intl, onClick }) => {
  const { completed = true } = account

  const missingRequirements = () => {
    if (account?.data?.requirements?.currently_due?.length > 0) {
      return account?.data?.requirements?.currently_due.map((requirement, index) => {
        const requirementItem = api.ACCOUNT_FIELDS?.[requirement]
        return requirementItem ? (
          <li key={index}>{intl.formatMessage(requirementItem)}</li>
        ) : (
          <li key={index}>
            {intl.formatMessage({
              id: 'consts.account.requirement.other',
              defaultMessage: 'Other',
            })}
          </li>
        )
      })
    }
  }
  return !validAccount(user, account) ? (
    <CustomAlert
      completed={completed}
      severity="warning"
      action={
        <Button
          completed={completed}
          onClick={onClick}
          variant="contained"
          color="secondary"
          label={
            <FormattedMessage id="transfers.alert.button" defaultMessage="Update your account" />
          }
        />
      }
    >
      <Typography variant="subtitle1" gutterBottom>
        <FormattedMessage
          id="profile.transfer.notactive"
          defaultMessage="Your account is not active, please finish the setup of your account to receive payouts"
        />
      </Typography>
      {missingRequirements() && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            <FormattedMessage
              id="profile.transfer.missingrequirements"
              defaultMessage="Missing requirements:"
            />
          </Typography>
          <ul>{missingRequirements()}</ul>
        </>
      )}
    </CustomAlert>
  ) : null
}

export default injectIntl(AccountRequirements)
