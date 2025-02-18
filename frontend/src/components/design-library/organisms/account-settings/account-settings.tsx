import React, { useState } from 'react';
import AccountButton from '../../molecules/account-button/account-button';
import AccountMenu from '../../molecules/account-menu/account-menu';

const AccountSettings = ({ user }) => {
  const [ open , setOpen ] = useState(false);
  return (
    <div>
       <AccountButton
          handleMenu={() => setOpen(!open)}
          user={user}          
       />
        <AccountMenu
          handleClose={() => setOpen(false)}
          open={open}
          user={user}
        />
    </div>

  );
}

export default AccountSettings;