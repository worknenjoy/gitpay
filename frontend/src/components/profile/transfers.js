import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  Typography
} from '@material-ui/core'

export const Transfers = () => {

  return (
    <div style={{margin: 40}}>
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id='profile.transfer.title' defaultMessage='Transfers' />
        </Typography>
      </Container>
    </div>
  )
}