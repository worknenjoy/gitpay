import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '../../../atoms/buttons/button/button'

interface ActivateAccountDialogProps {
  open: boolean
  onResend: () => void
  completed?: boolean
}

const RESEND_COOLDOWN_SECONDS = 60

const ActivateAccountDialog: React.FC<ActivateAccountDialogProps> = ({
  open,
  onResend,
  completed
}) => {
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = useCallback(() => {
    if (cooldown > 0) return
    onResend?.()
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }, [cooldown, onResend])

  const buttonLabel =
    cooldown > 0 ? (
      <FormattedMessage
        id="user.email.resend.link.label.cooldown"
        defaultMessage="Resend available in {seconds}s"
        values={{ seconds: cooldown }}
      />
    ) : (
      <FormattedMessage
        id="user.email.resend.link.label"
        defaultMessage="Resend verification link to your email"
      />
    )

  return (
    <Dialog open={open}>
      <DialogTitle itemType="h4">
        <FormattedMessage
          id="account.profile.email.verification"
          defaultMessage="Please check your e-mail"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message"
            defaultMessage="Please check your email inbox to validate your account to proceed"
          />
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message2"
            defaultMessage="If you have not received the email, please check your spam folder"
          />
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="account.profile.email.verification.message3"
            defaultMessage="If you have not received the email, please click below to resend"
          />
        </DialogContentText>
        <DialogActions>
          <Button
            completed={completed}
            onClick={handleResend}
            color="primary"
            variant="contained"
            disabled={cooldown > 0}
            label={buttonLabel}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default ActivateAccountDialog
