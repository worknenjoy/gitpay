import React from 'react'
import {
  ListItem,
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


const BottomSectionDialog = ({
  classes,
  header,
  title,
  subtitle,
  content,
}) => {

  const [ open, setOpen ] = React.useState(false)

  return (
    <ListItem button component='a'>
      <Typography
        variant='subtitle1'
        onClick={ () => setOpen(true) }
        component='div'
        style={ { display: 'block', width: '100%' } }
      >
        {header}
      </Typography>
      <Dialog
        fullScreen
        open={ open }
        onClose={ () => setOpen(false) }
      >
        <AppBar className={ classes.appBar }>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={ () => setOpen(false) }
              aria-label='Close'
            >
              <Close />
            </IconButton>
            <Typography variant='subtitle1' className={ classes.appBarHeader }>
              {title}
            </Typography>
          </Toolbar>
          <InfoList>
            {content}
          </InfoList>
        </AppBar>
      </Dialog>
    </ListItem>
  )
}

export default BottomSectionDialog