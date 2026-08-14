import React from 'react'

import { Drawer as MuiDrawer, Typography, Box, useMediaQuery, useTheme } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import DrawerActions from './drawer-actions/drawer-actions'
import { CloseFab } from './drawer.styles'

export type DrawerMode = 'default' | 'compact'

type DrawerProps = {
  open: boolean
  onClose: any
  title: any
  subtitle?: any
  children?: any
  actions?: Array<any>
  completed?: boolean
  /**
   * Layout density.
   * - default: full form-style side drawer (content-sized / wide)
   * - compact: fixed narrow width, tighter padding — suited to details / definition lists
   */
  mode?: DrawerMode
}

const Drawer = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions = [],
  completed = true,
  mode = 'default'
}: DrawerProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isCompact = mode === 'compact'
  const closeDialogButton = () => {
    return (
      <CloseFab size="small" aria-label="close" onClick={onClose} $compact={isCompact}>
        <CloseIcon fontSize="small" />
      </CloseFab>
    )
  }

  const paperWidth = isMobile ? '90vw' : isCompact ? 360 : null

  return (
    <MuiDrawer
      variant={isMobile ? 'temporary' : null}
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      anchor="right"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: paperWidth,
          maxWidth: '100vw',
          height: '100vh'
        }
      }}
    >
      <Box display="flex" flexDirection="column" height="100%" p={isCompact ? 0 : 2}>
        <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
          <Box
            sx={{
              position: 'relative',
              padding: isCompact ? 2 : 2.5,
              // leave room for the close fab
              pr: isCompact ? 5 : 2.5
            }}
          >
            <div>
              <Typography variant={isCompact ? 'h6' : 'h5'} id="form-dialog-title" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </div>
            {closeDialogButton()}
            {children}
          </Box>
        </Box>

        {actions.length > 0 && (
          <Box sx={{ px: isCompact ? 2 : 0, pb: isCompact ? 2 : 0 }}>
            <DrawerActions actions={actions} completed={completed} />
          </Box>
        )}
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
