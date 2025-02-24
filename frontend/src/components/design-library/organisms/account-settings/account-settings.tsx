import React, { useState } from 'react';
import AccountButton from '../../molecules/account-button/account-button';
import AccountMenu from '../../molecules/account-menu/account-menu';

const AccountSettings = ({ loggedIn, accountMenuProps }) => {
  const [ open , setOpen ] = useState(false);
  return (
    <div>
       <AccountButton
          handleMenu={() => setOpen(!open)}
          loggedIn={loggedIn}          
       />
        <AccountMenu
          handleClose={() => setOpen(false)}
          open={open}
          loggedIn={loggedIn}
          {...accountMenuProps}
        />
    </div>

  );
}

export default AccountSettings;