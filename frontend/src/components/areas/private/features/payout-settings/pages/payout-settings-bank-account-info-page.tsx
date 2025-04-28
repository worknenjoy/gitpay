import React, { useEffect } from 'react';
import PayoutSettingsBankAccountInfo from '../../../../../design-library/pages/private/payout-settings-bank-account-info/payout-settings-bank-account-info';

const PayoutSettingsBankAccountInfoPage = ({
  user,
  bankAccount,
  getBankAccount,
  updateBankAccount,
  createBankAccount,
  countries
}) => {
  const onUpdateBankAccount = async (e) => {
    e.preventDefault();
    const { id } = user;
    let formData = {
      'routing_number': e.target['routing_number'].value,
      'account_number': e.target['account_number'].value,
      'country': e.target['bank_account_country'].value,
      'account_holder_name':
        e.target['account_holder_name'].value,
      'account_holder_type':
        e.target['bank_account_type'].value,
      'currency': e.target['bank_account_currency'].value,
      //'external_account[bank_name]': e.target['bankCode'].value
    };
    
    if(bankAccount?.data?.id) {
      await updateBankAccount(id, formData);
    } else {
      await createBankAccount(id, formData);
    }
  };

  /*
  useEffect(() => {
    getBankAccount();
  }, []);
  */

  return (
    <div>
      <PayoutSettingsBankAccountInfo
        user={user}
        bankAccount={bankAccount}
        onSubmit={onUpdateBankAccount}
        countries={countries}
      />
    </div>
  );
}
export default PayoutSettingsBankAccountInfoPage;