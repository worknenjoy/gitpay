import React from 'react'
import { FormattedMessage } from 'react-intl';
import ProfileHeader from '../../../molecules/headers/profile-main-header/profile-main-header';
import BankAccountForm from '../../../organisms/forms/bank-account-form/bank-account-form'

const PayoutSetingsBankAccountHolder = ({
  user,
  bankAccount,
  countries,
  onSubmit,
  onChangeBankCode
}) => {
  
  return (
    <>
      <ProfileHeader
        title={<FormattedMessage id='payout-settings.bank-account-info.title' defaultMessage='Bank account information' />}
        subtitle={<FormattedMessage id='payout-settings.bank-account-info.description' defaultMessage='Please provide your bank account activation to receive payouts' />}
      />
      <BankAccountForm
        bankAccount={bankAccount}
        user={user}
        countries={countries}
        onSubmit={onSubmit}
        onChangeBankCode={onChangeBankCode}
      />
    </>
  );
}

export default PayoutSetingsBankAccountHolder;