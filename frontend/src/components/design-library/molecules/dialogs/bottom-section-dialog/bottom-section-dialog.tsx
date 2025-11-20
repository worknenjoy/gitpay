import React from 'react'
import { Dialog, IconButton, Slide } from '@mui/material'

import { Close } from '@mui/icons-material'

import { InfoList } from './CommonStyles'
import { AppBar as AppBarStyles, AppBarHeader, TopBarStyled } from './bottom-section-dialog.styles'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const BottomSectionDialog = ({ open, onClose, title, content }) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
    >
      <AppBarStyles>
        <TopBarStyled>
          <IconButton color="inherit" onClick={onClose} aria-label="Close">
            <Close />
          </IconButton>
          <AppBarHeader variant="subtitle1">{title}</AppBarHeader>
        </TopBarStyled>
        <InfoList>{content}</InfoList>
      </AppBarStyles>
    </Dialog>
  )
}

export default BottomSectionDialog
