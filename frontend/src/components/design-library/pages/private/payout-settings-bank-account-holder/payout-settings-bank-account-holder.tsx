import React from 'react'
import { FormattedMessage } from 'react-intl';
import AccountDetailsForm from '../../../organisms/forms/account-details-form/account-details-form'
import ProfileHeader from '../../../molecules/sections/profile-header/profile-header';

const PayoutSetingsBankAccountHolder = ({
  account,
  countries,
  onSubmit,
  onChange
}) => {
  
  return (
    <>
      <ProfileHeader
        title={<FormattedMessage id='payout-settings.bank-account-holder' defaultMessage='Account holder details' />}
        subtitle={<FormattedMessage id='payout-settings.bank-account-holder.description' defaultMessage='Please provide your information to activate your bank account.' />}
      />
      <AccountDetailsForm
        account={account}
        countries={countries}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </>
  );
}

export default PayoutSetingsBankAccountHolder;