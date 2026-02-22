import React from 'react'
import { Web, Logout, Dashboard } from '@mui/icons-material'
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import {
  AssignmentReturnedTwoTone as PayoutSettingsIcon,
  Receipt as InvoiceSettingsIcon,
  AccountBox as AccountIcon
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { ProfileAvatar } from './profile-account-menu.styles'
import { useHistory } from 'react-router-dom'
import useUserTypes from '../../../../../hooks/use-user-types'

const ProfileAccountMenuItems = ({
  open,
  anchorEl,
  handleClose,
  user,
  onLogout,
  includeDashboard = false
}) => {
  const history = useHistory()
  const { isContributor, isMaintainer, isFunding } = useUserTypes({ user })
  const { data } = user

  const bgColor = '#d8e2d9ff'

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {includeDashboard && (
        <MenuItem color="primary" onClick={(e) => history.push(`/`)}>
          <ListItemIcon>
            <ProfileAvatar bgColor={bgColor}>
              <Dashboard color="primary" fontSize="small" />
            </ProfileAvatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="text">
                <FormattedMessage id="profile.accountMenu.dashboard" defaultMessage="Dashboard" />
              </Typography>
            }
          />
        </MenuItem>
      )}
      <MenuItem color="primary" onClick={(e) => history.push(`/users/${data?.id}`)}>
        <ListItemIcon>
          <ProfileAvatar bgColor={bgColor}>
            <Web color="primary" fontSize="small" />
          </ProfileAvatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" color="text">
              <FormattedMessage id="profile.accountMenu.profile" defaultMessage="Profile" />
            </Typography>
          }
        />
      </MenuItem>
      <Divider />
      <MenuItem onClick={(e) => history.push('/profile/user-account')}>
        <ListItemIcon>
          <ProfileAvatar bgColor={bgColor}>
            <AccountIcon fontSize="small" />
          </ProfileAvatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" color="text">
              <FormattedMessage id="profile.accountMenu.myAccount" defaultMessage="My account" />
            </Typography>
          }
        />
      </MenuItem>
      {isContributor && (
        <MenuItem onClick={(e) => history.push('/profile/payout-settings')}>
          <ListItemIcon>
            <ProfileAvatar bgColor={bgColor}>
              <PayoutSettingsIcon fontSize="small" />
            </ProfileAvatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="text">
                <FormattedMessage
                  id="profile.accountMenu.payoutSettings"
                  defaultMessage="Payout Settings"
                />
              </Typography>
            }
          />
        </MenuItem>
      )}
      {(isMaintainer || isFunding) && (
        <MenuItem onClick={(e) => history.push('/profile/invoice-settings')}>
          <ListItemIcon>
            <ProfileAvatar bgColor={bgColor}>
              <InvoiceSettingsIcon fontSize="small" />
            </ProfileAvatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="text">
                <FormattedMessage
                  id="profile.accountMenu.invoiceSettings"
                  defaultMessage="Invoice Settings"
                />
              </Typography>
            }
          />
        </MenuItem>
      )}
      <Divider />
      {/* add later */}
      {/*<MenuItem onClick={handleClose}> */}
      {/*  <ListItemIcon> */}
      {/*    <Settings fontSize="small" /> */}
      {/*  </ListItemIcon> */}
      {/*  <FormattedMessage id="profile.accountMenu.settings" defaultMessage="Settings" /> */}
      {/* </MenuItem> */}
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <ProfileAvatar bgColor={bgColor}>
            <Logout fontSize="small" />
          </ProfileAvatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body2" color="text">
              <FormattedMessage id="profile.accountMenu.logout" defaultMessage="Logout" />
            </Typography>
          }
        />
      </MenuItem>
    </Menu>
  )
}

export default ProfileAccountMenuItems
