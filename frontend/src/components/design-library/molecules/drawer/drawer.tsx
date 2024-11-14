import React, { useState } from 'react'

import {
  Drawer as MuiDrawer,
  Container,
  Typography,
  Fab,
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
  },
}));
  
type DrawerProps = {
  open: boolean;
  onClose: any;
  title: any;
  children: any;
  actions?: Array<any>;
}

const Drawer = ({
  open,
  onClose,
  title,
  children,
  actions = []
}: DrawerProps) => {

  const classes = useStyles();

  const closeDialogButton = () => {
    
      return (
        <Fab size='small' aria-label='close' className={ classes.closeButton } onClick={ onClose }>
          <CloseIcon fontSize='small' />
        </Fab>
      )
    
  }

  return (
    <MuiDrawer
      open={open} onClose={onClose}
      aria-labelledby='form-dialog-title'
      anchor='right'
    >
      <Container>
        <div style={{ padding: 20 }}>
          <Typography variant='h5' id='form-dialog-title' gutterBottom>
            {title}
          </Typography>
          {closeDialogButton()}
          {children}
          { actions.length > 0 &&
            <DrawerActions actions={actions} />
          }
        </div>
      </Container>
    </MuiDrawer>
  )
}

export default Drawer
