import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material'

const TermsDialog = ({ open, onClose, onAccept, onDisagree }) => {
  const [agree, setAgree] = React.useState(false)

  const handleAgree = () => {
    setAgree(true)
    onAccept()
    onClose()
  }

  const handleDisagree = () => {
    setAgree(false)
    onDisagree()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="terms-dialog-title"
      aria-describedby="terms-dialog-description"
    >
      <DialogTitle id="terms-dialog-title">
        <FormattedMessage id="task.bounties.interested.termsOfUse" defaultMessage="TERMS OF USE" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="terms-dialog-description">
          <FormattedMessage
            id="task.bounties.interested.termsOfUseText"
            defaultMessage={
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            }
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          <FormattedMessage id="task.bounties.interested.disagree" defaultMessage="DISAGREE" />
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          <FormattedMessage id="task.bounties.interested.agree" defaultMessage="AGREE" />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsDialog
