import React from 'react'
import { Container } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from '../../../../design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutsTable from './payouts-table'

const Payouts = ({ payouts, searchPayout, user }) => {

  React.useEffect(() => {
    searchPayout()
  }, [searchPayout, user])

  return (
    <Container>
      <ProfileHeader
        title={<FormattedMessage id="payouts.title" defaultMessage="Payouts" />}
        subtitle={<FormattedMessage id="payouts.subtitle" defaultMessage="Manage your payouts and payment requests" />}
      />
      <PayoutsTable payouts={payouts} />
    </Container>
  )
}

export default Payouts