import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../atoms/buttons/button/button';
import CountryCurrency from '../../../molecules/forms/country-currency-form/country-currency-form';
import PersonalDetailsForm from '../../../molecules/forms/personal-details-form/personal-details-form';
import AddressInformationForm from '../../../molecules/forms/address-information-form/address-information-form';
import AcceptTermsField from '../../../atoms/inputs/fields/accept-terms-field/accept-terms-field';

const AccountDetailsForm = ({
  account,
  countries,
  onSubmit,
  onChange
}) => {
  const { data = {}, completed } = account;
  const { individual = {}, currency } = data;
  const { tos_acceptance = {}, country = '' } = data;
  const { address = {} } = individual;
  const { date } = tos_acceptance;
  const { line1 = '', line2 = '', city = '', state = '', postal_code = '' } = address;
  
  return (
    <form onSubmit={onSubmit}>
      <CountryCurrency
        country={country}
        countries={countries}
        currency={currency}
        completed={completed}
      />
      <PersonalDetailsForm
        account={account}
      />
      <AddressInformationForm
        addressLine1={line1}
        addressLine2={line2}
        city={city}
        state={state}
        zipCode={postal_code}
        country={country}
        completed={completed}
      />
      <AcceptTermsField
        accepted={!!date}
        acceptanceDate={date}
        country={country}
        onAccept={onChange}
        completed={completed}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="submit"
          variant="contained"
          color="secondary" 
          label={<FormattedMessage id='account.actions.update' defaultMessage='Update Account' />}
          disabled={false}
          completed={completed}
        />
      </div>
    </form>
  );
}
export default AccountDetailsForm;