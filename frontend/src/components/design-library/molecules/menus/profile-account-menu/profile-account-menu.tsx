import * as React from 'react'
import Box from '@mui/material/Box'
import MoreVert from '@mui/icons-material/MoreVert'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Person from '@mui/icons-material/Person'
import Button from '@mui/material/Button'
import nameInitials from 'name-initials'
import { ProfileAvatar } from './profile-account-menu.styles'
import ProfileAccountMenuItems from './profile-account-menu-items'

export default function ProfileAccountMenu({ user, onLogout }) {
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
          <Button onClick={handleClick} size="small" color="primary">
            {user?.picture_url ? (
              <ProfileAvatar alt={user.username || ''} src={user.picture_url} />
            ) : (
              <ProfileAvatar alt={user?.username || ''} src="">
                {user?.username ? nameInitials(user.username) : <Person color="primary" />}
              </ProfileAvatar>
            )}
            <div style={{ textAlign: 'left', marginLeft: 10, color: '#1c1c1f' }}>
              <Typography variant="body1" color="text">
                {user?.username}
              </Typography>
              <Typography variant="body2" style={{ fontSize: 8, color: '#666' }}>
                {user?.email}
              </Typography>
            </div>
            <MoreVert style={{ marginLeft: 5 }} />
          </Button>
        </Tooltip>
      </Box>
      <ProfileAccountMenuItems
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        user={user}
        onLogout={onLogout}
      />
    </React.Fragment>
  )
}
