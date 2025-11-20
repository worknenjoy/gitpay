// CardSection.js
import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Input, InputAdornment, FormControl, FormHelperText } from '@mui/material'
import { AccountCircle, Email } from '@mui/icons-material'

type Props = {
  error: { fullname?: boolean; email?: boolean }
  email?: string
  name?: string
}

const UserBasicInfoFormSection: React.FC<Props> = ({ error: errorProp, email, name }) => {
  const [error, setError] = useState<{ fullname: boolean; email: boolean }>({
    fullname: false,
    email: false,
  })

  useEffect(() => {
    if (errorProp) {
      setError({
        fullname: Boolean(errorProp.fullname),
        email: Boolean(errorProp.email),
      })
    }
  }, [errorProp])

  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)

  const onChangeName = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, fullname: ev.target.value.length < 1 }))
  }

  const onChangeEmail = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, email: ev.target.value.length < 1 }))
  }

  return (
    <label>
      <FormControl error={error.fullname}>
        <FormattedMessage id="user.data.fullname" defaultMessage="Full name">
          {(msg) => (
            <Input
              id="payment-form-user"
              name="fullname"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              placeholder={String(msg)}
              inputRef={nameInputRef}
              defaultValue={name}
              required
              style={{ marginRight: 20 }}
              onChange={onChangeName}
            />
          )}
        </FormattedMessage>
        {error.fullname && (
          <FormattedMessage id="user.data.fullname.error" defaultMessage="Provide your full name">
            {(msg) => <FormHelperText error={error.fullname}>{msg}</FormHelperText>}
          </FormattedMessage>
        )}
      </FormControl>
      <FormControl error={error.email}>
        <Input
          name="email"
          id="adornment-email"
          startAdornment={
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          }
          placeholder="e-mail"
          inputRef={emailInputRef}
          type="email"
          disabled={Boolean(email)}
          defaultValue={email}
          required
          onChange={onChangeEmail}
        />
        {error.email && (
          <FormattedMessage
            id="user.data.email.error"
            defaultMessage="Provide your email correctly"
          >
            {(msg) => <FormHelperText error={error.email}>{msg}</FormHelperText>}
          </FormattedMessage>
        )}
      </FormControl>
    </label>
  )
}

export default UserBasicInfoFormSection
