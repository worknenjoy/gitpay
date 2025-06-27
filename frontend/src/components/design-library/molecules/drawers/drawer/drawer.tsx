import React from 'react'

import {
  Drawer as MuiDrawer,
  Typography,
  Fab,
  Box
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'

import { Theme, makeStyles } from '@material-ui/core/styles';
import DrawerActions from './drawer-actions/drawer-actions';

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    backgroundColor: 'darkgray',
    color: 'white',
    boxShadow: 'none'
  }
}));

type DrawerProps = {
  open: boolean;
  onClose: any;
  title: any;
  subtitle?: any;
  children: any;
  actions?: Array<any>;
  completed?: boolean;
}

const Drawer = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions = [],
  completed = true
}: DrawerProps) => {

  const classes = useStyles();

  const closeDialogButton = () => {

    return (
      <Fab size="small" aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon fontSize="small" />
      </Fab>
    )

  }

  return (
    <MuiDrawer
      open={open} onClose={onClose}
      aria-labelledby="form-dialog-title"
      anchor="right"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        p={2}
      >
        
          <Box flexGrow={1}>
            <div style={{ padding: 20 }}>
              <div>
                <Typography variant="h5" id="form-dialog-title" gutterBottom>
                  {title}
                </Typography>
                { subtitle && 
                  <Typography variant="subtitle2" gutterBottom>
                    {subtitle}
                  </Typography>
                }
              </div>
              {closeDialogButton()}
              {children}
            </div>
          </Box>

          {actions.length > 0 &&
            <Box>
              <DrawerActions actions={actions} completed={completed} />
            </Box>
          }
        
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
