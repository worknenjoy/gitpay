import React from 'react';
import { Chip, Avatar, Button } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { StyledAvatar, StyledButton } from '../../../organisms/layouts/topbar/TopbarStyles';
import nameInitials from 'name-initials'


const AccountButton = ({
  handleMenu,
  loggedIn
}) => {
  const { user } = loggedIn;
  return (
    <>
      <StyledButton
        onClick={ handleMenu }
        variant='text'
        size='small'
        color='primary'
        id='account-menu'
      >
        <Chip
          avatar={ user.picture_url
            ? <StyledAvatar
              alt={ user.username || '' }
              src={ user.picture_url }
            />
            : <StyledAvatar alt={ user.username || '' } src=''>
              { user.username ? nameInitials(user.username) : <Person /> }
            </StyledAvatar>
          }
          color='secondary'
          label='Account'
          onClick={ handleMenu }
        />
      </StyledButton>
    </>
  );
}

export default AccountButton;