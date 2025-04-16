import React from 'react';
import PrivateBase from '../../../templates/base/private-base/private-base';
import AccountTabs from '../../../molecules/tabs/account-tabs/account-tabs';

const ProfileAccount = ({
  user,
  children
}) => {
  return (
    <PrivateBase
      createTask={() => {}}
      signOut={() => {}}
      user={user}
    >
      <AccountTabs
        user={user}
      >
        {children}
      </AccountTabs>
    </PrivateBase>
  );
}

export default ProfileAccount;