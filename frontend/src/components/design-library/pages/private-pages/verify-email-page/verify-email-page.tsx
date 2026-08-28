import React, { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { FormattedMessage } from 'react-intl'
import Button from '../../../atoms/buttons/button/button'
import SignupSigninBase from '../../../templates/base/signup-signin-base/signup-signin-base'

const RESEND_COOLDOWN_SECONDS = 60

interface VerifyEmailPageProps {
  onResend: () => void
  onSignOut: () => void
  completed?: boolean
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onResend, onSignOut, completed }) => {
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
    <SignupSigninBase>
      <Card style={{ maxWidth: 480, margin: '0 auto' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage
              id="account.profile.email.verification"
              defaultMessage="Please check your e-mail"
            />
          </Typography>
          <Typography variant="body1" gutterBottom>
            <FormattedMessage
              id="account.profile.email.verification.message"
              defaultMessage="Please check your email inbox to validate your account to proceed"
            />
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <FormattedMessage
              id="account.profile.email.verification.message2"
              defaultMessage="If you have not received the email, please check your spam folder"
            />
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <FormattedMessage
              id="account.profile.email.verification.message3"
              defaultMessage="If you have not received the email, please click below to resend"
            />
          </Typography>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <Button
              completed={completed}
              onClick={handleResend}
              color="primary"
              variant="contained"
              disabled={cooldown > 0}
              label={buttonLabel}
            />
            <Button
              onClick={onSignOut}
              variant="text"
              label={<FormattedMessage id="task.actions.account.logout" defaultMessage="Logout" />}
            />
          </div>
        </CardContent>
      </Card>
    </SignupSigninBase>
  )
}

export default VerifyEmailPage
