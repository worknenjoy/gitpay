import React from 'react';
import { FormattedMessage } from 'react-intl';
import TextMaskCustom from './text-mask-custom';
import Field from '../field/field';

const PhoneNumberField = ({ name = 'individual[phone]', phone }) => {
  return (
    <FormattedMessage id='account.verify.phone_number' defaultMessage='Phone number'>
      {
        (msg) => (
          <Field
            name={name}
            label={msg}
            defaultValue={ phone }
            help
            inputComponent={TextMaskCustom}
          />
        )}
    </FormattedMessage>
  );
}
export default PhoneNumberField;