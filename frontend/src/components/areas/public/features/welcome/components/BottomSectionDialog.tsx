import React from 'react'
import {
  ListItem,
  ListItemButton,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'

import {
  Close,
} from '@mui/icons-material'

import { InfoList } from './CommonStyles'
import { AppBar as AppBarStyles, AppBarHeader } from './bottom-section-dialog.styles'


const BottomSectionDialog = ({
  classes,
  header,
  title,
  subtitle,
  content,
}) => {

  const [ open, setOpen ] = React.useState(false)

  return (
    <ListItem component='div'>
      <ListItemButton component='a'>
      <Typography
        variant='subtitle1'
        onClick={ () => setOpen(true) }
        component='div'
        style={ { display: 'block', width: '100%' } }
      >
        {header}
      </Typography>
      </ListItemButton>
      <Dialog
        fullScreen
        open={ open }
        onClose={ () => setOpen(false) }
      >
        <AppBarStyles>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={ () => setOpen(false) }
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
    </ListItem>
  )
}

export default BottomSectionDialog