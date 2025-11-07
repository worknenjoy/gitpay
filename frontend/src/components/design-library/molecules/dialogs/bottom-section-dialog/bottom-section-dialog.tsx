import React from 'react'
import {
  Dialog,
  Toolbar,
  IconButton,
} from '@mui/material'

import {
  Close,
} from '@mui/icons-material'

import { InfoList } from './CommonStyles'
import { AppBar as AppBarStyles, AppBarHeader } from './bottom-section-dialog.styles'


const BottomSectionDialog = ({
  open,
  onClose,
  title,
  content,
}) => {

  return (
    <Dialog
      fullScreen
      open={ open }
      onClose={ onClose }
    >
      <AppBarStyles>
        <Toolbar>
          <IconButton
            color='inherit'
            onClick={ onClose }
            aria-label='Close'
          >
            <Close />
          </IconButton>
          <AppBarHeader variant='subtitle1'>
            {title}
          </AppBarHeader>
        </Toolbar>
        <InfoList>
          {content}
        </InfoList>
      </AppBarStyles>
    </Dialog>
  )
}

export default BottomSectionDialog