import React from 'react'
import { Chip } from '@mui/material'
import { Person } from '@mui/icons-material'
import { StyledAvatar, StyledButton } from './account-buttons.styles'
import nameInitials from 'name-initials'

const AccountButton = ({ handleMenu, user }) => {
  const { data } = user
  const { username, picture_url } = data

  return (
    <>
      <StyledButton
        onClick={handleMenu}
        variant="text"
        size="medium"
        color="primary"
        id="account-menu"
      >
        <Chip
          avatar={
            picture_url ? (
              <StyledAvatar alt={username || ''} src={picture_url} />
            ) : (
              <StyledAvatar alt={username || ''} src="">
                {username ? nameInitials(username) : <Person />}
              </StyledAvatar>
            )
          }
          color="secondary"
          label="Account"
          onClick={handleMenu}
        />
      </StyledButton>
    </>
  )
}

export default AccountButton
