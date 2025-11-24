import React from 'react'

import { Drawer as MuiDrawer, Typography, Box, useMediaQuery, useTheme } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import DrawerActions from './drawer-actions/drawer-actions'
import { CloseFab } from './drawer.styles'

type DrawerProps = {
  open: boolean
  onClose: any
  title: any
  subtitle?: any
  children?: any
  actions?: Array<any>
  completed?: boolean
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
<<<<<<< HEAD
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
=======
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
>>>>>>> master
  const closeDialogButton = () => {
    return (
      <CloseFab size="small" aria-label="close" onClick={onClose}>
        <CloseIcon fontSize="small" />
      </CloseFab>
    )
  }

  return (
    <MuiDrawer 
      variant={ isMobile ? "temporary" : "persistent" }
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: isMobile ? "90vw" : null,
          maxWidth: "100vw",
          height: "100vh",
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%" p={2}>
        <Box flexGrow={1}>
          <div style={{ padding: 20 }}>
            <div>
              <Typography variant="h5" id="form-dialog-title" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" gutterBottom>
                  {subtitle}
                </Typography>
              )}
            </div>
            {closeDialogButton()}
            {children}
          </div>
        </Box>

        {actions.length > 0 && (
          <Box>
            <DrawerActions actions={actions} completed={completed} />
          </Box>
        )}
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
