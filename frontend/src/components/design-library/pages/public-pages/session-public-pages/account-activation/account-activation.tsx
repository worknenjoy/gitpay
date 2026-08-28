import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'

type ActivationStatus = 'checking' | 'idle' | 'loading' | 'activated' | 'error'

const AccountActivation = ({ onActivateAccount, onCheckStatus }) => {
  const [status, setStatus] = React.useState<ActivationStatus>('checking')

  const history = useHistory()
  const { token, userId } = useParams<{ token: string; userId: string }>()

  useEffect(() => {
    const checkStatus = async () => {
      const result = await onCheckStatus(userId)
      setStatus(result?.email_verified ? 'activated' : 'idle')
    }
    checkStatus()
  }, [])

  const handleActivate = async () => {
    setStatus('loading')
    const activateAccount = await onActivateAccount(token, userId)
    setStatus(activateAccount.error ? 'error' : 'activated')
  }

  return (
    <div>
      <Dialog open aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          {status === 'checking' && (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="account.activating" defaultMessage="Activating your account…" />
            </DialogContentText>
          )}
          {status === 'idle' && (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage
                id="account.activate.prompt"
                defaultMessage="Click below to activate your account."
              />
            </DialogContentText>
          )}
          {status === 'loading' && (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="account.activating" defaultMessage="Activating your account…" />
            </DialogContentText>
          )}
          {status === 'activated' && (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage
                id="account.activated"
                defaultMessage="Your account is active now, you can now back to login"
              />
            </DialogContentText>
          )}
          {status === 'error' && (
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage
                id="account.not.activated"
                defaultMessage="Your account is not active, please try again"
              />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {(status === 'idle' || status === 'error') && (
            <Button onClick={handleActivate}>
              <FormattedMessage id="account.activate.button" defaultMessage="Activate my account" />
            </Button>
          )}
          {status !== 'checking' && (
            <Button onClick={() => history.push('/signin')}>
              <FormattedMessage id="close" defaultMessage="back to login" />
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AccountActivation
