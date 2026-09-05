import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@mui/material'

const messages = defineMessages({
  title: {
    id: 'task.bounties.interested.termsOfUse',
    defaultMessage: 'TERMS OF USE'
  },
  text: {
    id: 'task.bounties.interested.termsOfUseText',
    defaultMessage:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  agree: {
    id: 'task.bounties.interested.agree',
    defaultMessage: 'AGREE'
  },
  disagree: {
    id: 'task.bounties.interested.disagree',
    defaultMessage: 'DISAGREE'
  }
})

interface TermsDialogProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
  onDisagree: () => void
  content?: React.ReactNode
}

const TermsDialog = ({ open, onClose, onAccept, onDisagree, content }: TermsDialogProps) => {
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
      {!content && (
        <DialogTitle id="terms-dialog-title">
          <FormattedMessage {...messages.title} />
        </DialogTitle>
      )}
      <DialogContent>
        {content ?? (
          <DialogContentText id="terms-dialog-description">
            <FormattedMessage {...messages.text} />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary" size="small">
          <FormattedMessage {...messages.disagree} />
        </Button>
        <Button onClick={handleAgree} color="primary" size="small" autoFocus>
          <FormattedMessage {...messages.agree} />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsDialog
