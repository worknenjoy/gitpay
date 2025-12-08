import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './payment-requests-dashboard-card.styles';
import paymentRequestIcon from 'images/icons/noun_project management_3063535.svg';

const PaymentRequestsDashboardCard = ({
  requests = 0,
  pending = 0,
  paid = 0,
}) => {
  return (
    <DashboardCardBase
      image={paymentRequestIcon}
      title={<FormattedMessage id="account.profile.paymentRequests.headline" defaultMessage="Payment Requests" />}
      subheader={<FormattedMessage id="account.profile.paymentRequests.overview" defaultMessage="{requests} requests created" values={{ requests }} />}
      buttonText={<FormattedMessage id="account.profile.paymentRequests.buttonText" defaultMessage="View payment requests" />}
      buttonLink="/profile/payment-requests"
    >
      <DashboardCardChipList>
        <Chip size='small' label={<FormattedMessage id="account.profile.paymentRequests.chip.pending" defaultMessage="{pending} pending" values={{ pending }} />} color="warning" />
        <Chip size='small' label={<FormattedMessage id="account.profile.paymentRequests.chip.paid" defaultMessage="{paid} paid" values={{ paid }} />} color="success" />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default PaymentRequestsDashboardCard;