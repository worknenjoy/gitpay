import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import Button from '../../../atoms/buttons/button/button';
import CountryCurrency from '../../../molecules/form-section/country-currency-form/country-currency-form';
import PersonalDetailsForm from '../../../molecules/form-section/personal-details-form/personal-details-form';
import AddressInformationForm from '../../../molecules/form-section/address-information-form/address-information-form';
import AcceptTermsField from '../../../atoms/inputs/fields/accept-terms-field/accept-terms-field';
import Alert from '../../../atoms/alerts/alert/alert';
import ProfileSecondaryHeader from '../../../molecules/headers/profile-secondary-header/profile-secondary-header';
import AccountHolderStatus from '../../../atoms/status/account-status/account-holder-status/account-holder-status';

const errorMapping = {
  'individual[dob][day]': 'Invalid day of birth',
  'individual[dob][month]': 'Invalid month of birth',
  'individual[dob][year]': 'Invalid year of birth',
  'individual[address][line1]': 'Invalid address line 1',
  'individual[address][line2]': 'Invalid address line 2',
  'individual[address][city]': 'Invalid city',
  'individual[address][state]': 'Invalid state',
  'individual[address][postal_code]': 'Invalid postal code',
  'individual[phone]': 'Invalid phone number',
  'individual[first_name]': 'Invalid first name',
  'individual[last_name]': 'Invalid last name',
}

const AccountDetailsForm = ({
  account,
  countries,
  onSubmit,
  onChange
}) => {
  const { data = {}, completed, error = {} } = account;
  const { individual = {}, capabilities = {}, currency } = data;
  const { tos_acceptance = {}, country = '' } = data;
  const { transfers: accountHolderStatus} = capabilities;
  const { address = {} } = individual;
  const { date } = tos_acceptance;
  const { line1 = '', line2 = '', city = '', state = '', postal_code = '' } = address;
  
  return (
    <form onSubmit={onSubmit}>
      <ProfileSecondaryHeader
        title={<FormattedMessage id='payout-settings.bank-account-holder' defaultMessage='Account holder details' />}
        subtitle={<FormattedMessage id='payout-settings.bank-account-holder.description' defaultMessage='Please provide your information to activate your bank account.' />}
        aside={
          <AccountHolderStatus
            status={accountHolderStatus}
            completed={completed}
          />
        }
      />
      {error.raw && (
        <Alert
          severity="error"
          style={{ marginBottom: 10, margintTop: 10 }}
          completed={completed}
        >
          <div style={{ marginBottom: 20 }}>
            <FormattedMessage
              id="account.update.error"
              defaultMessage="An error occurred while updating account details:"
            />
          </div>
          <Typography variant="body1" color="error">
            {errorMapping[error.param] ? `${errorMapping[error.param]} - ${error.raw.message}`  : error.raw.message}
          </Typography>
        </Alert>
      )}
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