import React, { useState } from 'react'
import { FormControl, FormControlLabel, Typography, Switch } from '@mui/material'
import { FormattedMessage, FormattedDate } from 'react-intl'
import Moment from 'moment'
import Fieldset from '../../fieldset/fieldset'

const AcceptTermsField = ({ accepted, acceptanceDate, onAccept, country, completed }) => {
  const [terms, setTerms] = useState(false)

  const handleTerms = (e) => {
    const checked = e.target.checked
    setTerms(checked)
    onAccept(checked)
  }

  return (
    <Fieldset
      completed={completed}
      legend={
        <FormattedMessage id="account.details.terms.title" defaultMessage="Terms of Service" />
      }
    >
      {!accepted ? (
        <>
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  name="tos_acceptance"
                  checked={terms}
                  onChange={handleTerms}
                  value={terms}
                  color="primary"
                />
              }
              label={
                <FormattedMessage
                  id="account.details.terms.read"
                  defaultMessage="I read and I accept the Stripe terms to receive transfers about payments directly on my account"
                />
              }
            />
          </FormControl>
          <FormControl>
            <Typography color="primary" style={{ marginTop: 8 }}>
              <a
                target="_blank"
                href={`https://stripe.com/${country}/connect-account/legal`}
                rel="noreferrer"
              >
                {' '}
                <FormattedMessage
                  id="account.details.terms.access"
                  defaultMessage="see stripe terms"
                />{' '}
              </a>
            </Typography>
          </FormControl>
        </>
      ) : (
        <FormControl style={{ display: 'block' }}>
          <Typography color="primary" style={{ display: 'block' }}>
            <FormattedMessage
              id="account.terms.accepted"
              defaultMessage="You agreed with the terms in "
            />{' '}
            <FormattedDate value={Moment.unix(acceptanceDate).toDate()} />
          </Typography>
        </FormControl>
      )}
    </Fieldset>
  )
}
export default AcceptTermsField
