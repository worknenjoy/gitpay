import React from 'react'
import { FormattedMessage } from 'react-intl'
import TextMaskCustom from './text-mask-custom'
import Field from '../field/field'

const PhoneNumberField = ({ phone }) => {
  return (
    <FormattedMessage id="account.verify.phone_number" defaultMessage="Phone number">
      {(msg) => (
        <Field
          name="phone_number"
          label={msg}
          defaultValue={phone}
          help
          inputComponent={TextMaskCustom}
        />
      )}
    </FormattedMessage>
  )
}
export default PhoneNumberField
