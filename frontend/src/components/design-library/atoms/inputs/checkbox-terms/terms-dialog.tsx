import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@mui/material'

interface TermsDialogProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
  onDisagree: () => void
  titleId?: string
  titleDefaultMessage?: string
  textId?: string
  textDefaultMessage?: string
  agreeId?: string
  agreeDefaultMessage?: string
  disagreeId?: string
  disagreeDefaultMessage?: string
  content?: React.ReactNode
}

const TermsDialog = ({
  open,
  onClose,
  onAccept,
  onDisagree,
  titleId = 'task.bounties.interested.termsOfUse',
  titleDefaultMessage = 'TERMS OF USE',
  textId = 'task.bounties.interested.termsOfUseText',
  textDefaultMessage = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  agreeId = 'task.bounties.interested.agree',
  agreeDefaultMessage = 'AGREE',
  disagreeId = 'task.bounties.interested.disagree',
  disagreeDefaultMessage = 'DISAGREE',
  content
}: TermsDialogProps) => {
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
          <FormattedMessage id={titleId} defaultMessage={titleDefaultMessage} />
        </DialogTitle>
      )}
      <DialogContent>
        {content ?? (
          <DialogContentText id="terms-dialog-description">
            <FormattedMessage id={textId} defaultMessage={textDefaultMessage} />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary" size="small">
          <FormattedMessage id={disagreeId} defaultMessage={disagreeDefaultMessage} />
        </Button>
        <Button onClick={handleAgree} color="primary" size="small" autoFocus>
          <FormattedMessage id={agreeId} defaultMessage={agreeDefaultMessage} />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsDialog
