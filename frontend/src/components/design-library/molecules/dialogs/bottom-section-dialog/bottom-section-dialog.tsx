import React from 'react'
import {
  ListItem,
  Typography,
  Dialog,
  Toolbar,
  IconButton,
  Slide,
  SlideProps
} from '@mui/material'

import {
  Close
} from '@mui/icons-material'

import { InfoList, AppBarStyled, AppBarHeader, HeaderTypography } from './bottom-section-dialog.styles'


const BottomSectionDialog = ({
  Transition = React.forwardRef<unknown, SlideProps>((props, ref) => (
    <Slide direction="up" ref={ ref } { ...props } />
  )),
  header,
  title,
  subtitle,
  content
}) => {

  const [ open, setOpen ] = React.useState(false)

  return (
    <ListItem button component="a">
  <Typography variant="subtitle1" onClick={ () => setOpen(!open) } component={HeaderTypography as any}>
        {header}
      </Typography>
      <Dialog
        fullScreen
        TransitionComponent={ Transition }
        open={ open }
        onClose={ () => setOpen(false) }
      >
    <AppBarStyled>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={ () => setOpen(false) }
              aria-label="Close"
            >
              <Close />
            </IconButton>
      <Typography variant="subtitle1" component={AppBarHeader as any}>
              {title}
            </Typography>
          </Toolbar>
          <InfoList>
            {content}
          </InfoList>
    </AppBarStyled>
      </Dialog>
    </ListItem>
  )
}

export default BottomSectionDialog