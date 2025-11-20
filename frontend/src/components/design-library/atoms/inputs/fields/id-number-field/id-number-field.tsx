import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Button } from '@mui/material'
import Field from '../field/field'
import messages from '../../../../../areas/private/shared/messages'

const IdNumberField = ({ account }) => {
  const { data: accountData } = account
  const [editIdNumber, setEditIdNumber] = React.useState(false)
  const intl = useIntl()

  const shouldDisableIdNumber = () => {
    if (editIdNumber) {
      return false
    }
    return (
      accountData['individual[id_number]'] ||
      (accountData.individual && accountData.individual.id_number_provided)
    )
  }

  return (
    <Field
      name="individual[id_number]"
      label={
        editIdNumber
          ? intl.formatMessage(messages.documentProvide)
          : accountData.individual && accountData.individual.id_number_provided
            ? intl.formatMessage(messages.documentProvided)
            : intl.formatMessage(messages.documentProvide)
      }
      placeholder={
        editIdNumber
          ? intl.formatMessage(messages.documentProvide)
          : accountData.individual && accountData.individual.id_number_provided
            ? intl.formatMessage(messages.documentProvided)
            : intl.formatMessage(messages.documentProvide)
      }
      disabled={shouldDisableIdNumber()}
      defaultValue={
        editIdNumber
          ? ''
          : accountData['individual[id_number]'] ||
            (accountData.individual && accountData.individual.id_number)
      }
      endAdornment={
        accountData.individual &&
        accountData.individual.id_number_provided && (
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={(e) => {
              setEditIdNumber(!editIdNumber)
            }}
          >
            {!editIdNumber ? (
              <FormattedMessage id="account.actions.id.edit" defaultMessage="Change" />
            ) : (
              <FormattedMessage id="account.actions.id.cancel" defaultMessage="Cancel" />
            )}
          </Button>
        )
      }
    />
  )
}
export default IdNumberField
