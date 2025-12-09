import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './payment-requests-dashboard-card.styles';
import paymentRequestIcon from 'images/icons/noun_project management_3063535.svg';
import { formatCurrency } from '../../../../../../utils/format-currency';

const PaymentRequestsDashboardCard = ({
  paymentRequests
}) => {
  const { total = 0, amount = 0, payments = 0 } = paymentRequests || {};
  return (
    <DashboardCardBase
      image={paymentRequestIcon}
      title={<FormattedMessage id="account.profile.paymentRequests.headline" defaultMessage="Payment Requests" />}
      subheader={<FormattedMessage id="account.profile.paymentRequests.overview" defaultMessage="{total} payment requests links created" values={{ total }} />}
      buttonText={<FormattedMessage id="account.profile.paymentRequests.buttonText" defaultMessage="View payment requests" />}
      buttonLink="/profile/payment-requests"
    >
      <DashboardCardChipList>
        <Chip size='small' label={<FormattedMessage id="account.profile.paymentRequests.chip.payments" defaultMessage="{payments} payment(s)" values={{ payments }} />} color="success" />
        <Chip size='small' label={<FormattedMessage id="account.profile.paymentRequests.chip.amount" defaultMessage="{amount} paid" values={{ amount: formatCurrency(amount) }} />} color="info" />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default PaymentRequestsDashboardCard;