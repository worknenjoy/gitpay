import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormControl, Input, InputLabel } from '@mui/material'

const EmailInviteInput = ({ onEmailInviteChange }) => {
  return (
    <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }}>
      <InputLabel htmlFor="email-funding-invite">
        <FormattedMessage
          id="task.funding.email"
          defaultMessage="Please provide the invitee e-mail"
        />
      </InputLabel>
      <Input id="email" type="email" name="email-funding-invite" onChange={onEmailInviteChange} />
    </FormControl>
  )
}

export default EmailInviteInput
