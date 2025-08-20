import React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert as MoreIcon, Visibility as VisibilityIcon } from '@mui/icons-material';


export const ActionsMenu = (props) => {
  const { actions, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleMoreButton = (e) => {
    e.preventDefault()
    console.log('More button clicked')
    setAnchorEl({ anchorEl: e.currentTarget });
  }

  return (
    <div className="actions-menu" {...rest}>
      <IconButton onClick={handleMoreButton}>
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={() => setAnchorEl({ anchorEl: null })}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={action.onClick} style={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary={action.children} />
          </MenuItem>
        ))}
       
      </Menu>
    </div>
  );
}

export default ActionsMenu;