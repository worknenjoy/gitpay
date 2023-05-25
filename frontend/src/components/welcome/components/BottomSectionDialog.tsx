import React from 'react'
import {
  ListItem,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core'

import {
  Close,
} from '@material-ui/icons'

import { MainTitle, InfoList } from './CommonStyles'


const BottomSectionDialog = ({
  classes,
  Transition,
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
        onClick={ () => setOpen(!open) }
        component='div'
        style={ { display: 'block', width: '100%' } }
      >
        {header}
      </Typography>
      <Dialog
        fullScreen
        TransitionComponent={ Transition }
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