import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import MoreVert from '@mui/icons-material/MoreVert'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Logout from '@mui/icons-material/Logout'
import Person from '@mui/icons-material/Person'
import Button from '@mui/material/Button'
import { Web, AccountBox as AccountIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { nameInitials } from 'name-initials'

export default function AccountMenu({ user, history, onLogout }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <Button onClick={handleClick} size="small">
            {user.picture_url ? (
              <Avatar alt={user.username || ''} src={user.picture_url} />
            ) : (
              <Avatar alt={user.username || ''} src="">
                {user.username ? nameInitials(user.username) : <Person />}
              </Avatar>
            )}
            <div style={{ textAlign: 'left', marginLeft: 10, color: '#1c1c1f' }}>
              <Typography variant="body1" color="text">
                {user.username}
              </Typography>
              <Typography variant="body2" style={{ fontSize: 8, color: '#666' }}>
                {user.email}
              </Typography>
            </div>
            <MoreVert style={{ marginLeft: 5 }} />
          </Button>
        </Tooltip>
      </Box>
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
              mr: 1,
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
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={(e) => history.push(`/users/${user.id}`)} style={{ margin: 5 }}>
          <Avatar>
            <Web width={12} />
          </Avatar>
          <Typography variant="body2" color="text">
            <FormattedMessage id="profile.accountMenu.profile" defaultMessage="Profile" />
          </Typography>
        </MenuItem>
        <MenuItem onClick={(e) => history.push('/profile/user-account')} style={{ margin: 5 }}>
          <Avatar>
            <AccountIcon width={12} />
          </Avatar>
          <Typography variant="body2" color="text">
            <FormattedMessage id="profile.accountMenu.myAccount" defaultMessage="My account" />
          </Typography>
        </MenuItem>
        <MenuItem onClick={(e) => history.push('/profile/payout-settings')} style={{ margin: 5 }}>
          <Avatar>
            <SettingsIcon width={12} />
          </Avatar>
          <Typography variant="body2" color="text">
            <FormattedMessage
              id="profile.accountMenu.payoutSettings"
              defaultMessage="Payout Settings"
            />
          </Typography>
        </MenuItem>
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
            <Logout fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="profile.accountMenu.logout" defaultMessage="Logout" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
