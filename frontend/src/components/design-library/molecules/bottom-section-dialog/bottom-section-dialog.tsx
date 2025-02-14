import React from 'react'
import {
  ListItem,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  SlideProps,
} from '@material-ui/core'

import {
  Close,
} from '@material-ui/icons'

import { InfoList } from './bottom-section-dialog.styles'


const BottomSectionDialog = ({
  classes,
  Transition = React.forwardRef<unknown, SlideProps>((props, ref) => (
    <Slide direction='up' ref={ ref } { ...props } />
  )),
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