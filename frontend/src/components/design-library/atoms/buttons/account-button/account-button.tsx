import React from 'react';
import { Chip } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { StyledAvatar, StyledButton } from '../../../organisms/layouts/topbar/TopbarStyles';
import nameInitials from 'name-initials'


const AccountButton = ({
  handleMenu,
  loggedIn
}) => {
  const { data } = loggedIn;
  const { username, picture_url } = data;
  
  return (
    <>
      <StyledButton
        onClick={ handleMenu }
        variant="text"
        size="small"
        color="primary"
        id="account-menu"
      >
        <Chip
          avatar={ picture_url
            ? <StyledAvatar
              alt={ username || '' }
              src={ picture_url }
            />
            : <StyledAvatar alt={ username || '' } src="">
              { username ? nameInitials(username) : <Person /> }
            </StyledAvatar>
          }
          color="secondary"
          label="Account"
          onClick={ handleMenu }
        />
      </StyledButton>
    </>
  );
}

export default AccountButton;