import React, { useState } from 'react';
import AccountButton from '../../../atoms/buttons/account-button/account-button';
import AccountMenu from '../../menus/account-menu/account-menu';

const AccountSettings = ({ loggedIn, accountMenuProps }) => {
  const [ open , setOpen ] = useState(false);
  return (
    <div>
       <AccountButton
          handleMenu={() => setOpen(!open)}
          loggedIn={loggedIn}          
       />x
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