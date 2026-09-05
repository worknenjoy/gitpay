import React, { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import Button from '../../../atoms/buttons/button/button'
import CheckboxTerms from '../../../atoms/inputs/checkbox-terms/checkbox-terms'
import TermsOfService from '../../../molecules/content/terms/terms-of-service/terms-of-service'
import SignupSigninBase from '../../../templates/base/signup-signin-base/signup-signin-base'
import UserProfileTypeCards from '../../../atoms/inputs/fields/user-profile-type-field/user-profile-type-cards'
import {
  StyledTextField,
  Margins
} from '../../../molecules/form-section/login-form/login-form-signup/login-form-signup.styles'

type ProfileType = {
  id: string | number
  name: string
  label: string
  description?: string
}

interface AcceptTermsPageProps {
  onAccept: (payload: { name?: string; Types?: Array<string | number> }) => Promise<any>
  completed?: boolean
  user?: { name?: string; Types?: ProfileType[] }
  profileTypes?: { data: ProfileType[]; completed?: boolean }
  fetchLoggedUser?: () => void
  fetchProfileTypes?: () => void
}

const AcceptTermsPage: React.FC<AcceptTermsPageProps> = ({
  onAccept,
  completed,
  user,
  profileTypes,
  fetchLoggedUser,
  fetchProfileTypes
}) => {
  const intl = useIntl()
  const history = useHistory()
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [types, setTypes] = useState<Array<string | number>>([])
  const hasEditedNameRef = useRef(false)
  const hasSeededTypesRef = useRef(false)

  useEffect(() => {
    fetchLoggedUser?.()
    fetchProfileTypes?.()
  }, [])

  useEffect(() => {
    if (hasEditedNameRef.current) return
    if (user?.name) setName(user.name)
  }, [user?.name])

  useEffect(() => {
    // Seed once from the user's existing types, if any (GitHub signups typically have
    // none). Only fires the first time server data with types arrives, so it never
    // clobbers a selection the user already made via the picker.
    if (hasSeededTypesRef.current) return
    if (user?.Types?.length) {
      setTypes(user.Types.map((type) => type.id))
      hasSeededTypesRef.current = true
    }
  }, [user?.Types])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    hasEditedNameRef.current = true
    setName(event.target.value)
  }

  const handleTypesChange = (checkedIds: Array<string | number>) => {
    setTypes(checkedIds)
  }

  const handleContinue = async () => {
    if (!checked || submitting) return
    setSubmitting(true)
    await onAccept({ name, Types: types })
    history.push('/profile')
  }

  return (
    <SignupSigninBase>
      <Card style={{ maxWidth: 880, margin: '0 auto' }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Margins>
            <Typography variant="h5">
              <FormattedMessage id="account.setup.title" defaultMessage="Complete your account" />
            </Typography>
          </Margins>
          <Margins>
            <Typography variant="body1">
              <FormattedMessage
                id="account.setup.text"
                defaultMessage="You're signed in with GitHub. Confirm your name, choose how you'll use Gitpay, and accept our Terms of Service to finish setting up your account."
              />
            </Typography>
          </Margins>
          <Margins>
            <StyledTextField
              name="name"
              onChange={handleNameChange}
              value={name}
              fullWidth
              label={intl.formatMessage({ id: 'account.login.label.name', defaultMessage: 'Name' })}
              variant="outlined"
              id="name"
            />
          </Margins>
          <Margins>
            <UserProfileTypeCards
              profileTypes={profileTypes ?? { data: [], completed: false }}
              onChange={handleTypesChange}
              selected={types}
            />
          </Margins>
          <div style={{ marginTop: 16 }}>
            <CheckboxTerms
              onAccept={setChecked}
              variant="account"
              content={<TermsOfService extraStyles={false} />}
              align="right"
            />
          </div>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              completed={completed && !submitting}
              onClick={handleContinue}
              color="primary"
              variant="contained"
              size="small"
              disabled={!checked}
              label={
                <FormattedMessage id="account.setup.complete" defaultMessage="Complete signup" />
              }
            />
          </div>
        </CardContent>
      </Card>
    </SignupSigninBase>
  )
}

export default AcceptTermsPage
