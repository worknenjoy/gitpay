import React, { useState } from 'react';
import { FormControl, FormControlLabel, Typography, Switch } from '@material-ui/core';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Moment from 'moment';
import Fieldset from '../../fieldset/fieldset';

const AcceptTermsField = ({ accepted, acceptanceDate, onAccept, country, completed }) => {
  const [terms, setTerms] = useState(false)

  const handleTerms = () => {
    setTerms(!terms)
    onAccept()
  }
  return (
    <Fieldset completed={completed} legend='Accept Terms'>
      {!accepted ? (
        <>
          <FormControl>
            <FormattedMessage
              id='account.details.terms.read'
              defaultMessage='I read and I accept the Stripe terms to receive transfers about payments directly on my account'
            >
              {(msg) => (
                <FormControlLabel
                  control={
                    <Switch
                      name='tos_acceptance'
                      checked={terms}
                      onChange={handleTerms}
                      value={terms}
                      color='primary'
                    />
                  }
                  label={msg}
                />
              )}
            </FormattedMessage>
          </FormControl>
          <FormControl>
            <Typography color='primary' style={{ marginTop: 8 }}>
              <a
                target='_blank'
                href={`https://stripe.com/${country}/connect-account/legal`} rel="noreferrer"
              >
                {' '}
                <FormattedMessage id='account.details.terms.access' defaultMessage='see stripe terms' />{' '}
              </a>
            </Typography>
          </FormControl>
        </>
      ) : (
        <FormControl style={{ display: 'block' }}>
          <Typography color='primary' style={{ display: 'block' }}>
            <FormattedMessage id='account.terms.accepted' defaultMessage='You agreed with the terms in ' />
            {' '}
            <FormattedDate value={Moment.unix(
              acceptanceDate
            ).toDate()} />
          </Typography>
        </FormControl>
      )}
    </Fieldset>
  );
}
export default AcceptTermsField;