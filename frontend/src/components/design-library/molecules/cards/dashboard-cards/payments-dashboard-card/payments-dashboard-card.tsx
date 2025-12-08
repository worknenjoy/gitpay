import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './payments-dashboard-card.styles';
import paymentIcon from 'images/icons/noun_project management_3063535.svg';

const PaymentsDashboardCard = ({
  payments = 0,
  succeeded = 0,
  failed = 0,
}) => {
  return (
    <DashboardCardBase
      image={paymentIcon}
      title={
        <FormattedMessage id="account.profile.payments.headline" defaultMessage="Payments" />
      }
      subheader={
        <FormattedMessage
          id="account.profile.payments.overview"
          defaultMessage="{payments} payments processed"
          values={{ payments }}
        />
      }
      buttonText={
        <FormattedMessage id="account.profile.payments.buttonText" defaultMessage="See your payments" />
      }
      buttonLink="/profile/payments"
    >
      <DashboardCardChipList>
        <Chip
          size='small'
          label={
            <FormattedMessage
              id="account.profile.payments.chip.succeeded"
              defaultMessage="{succeeded} succeeded"
              values={{ succeeded }}
            />
          }
          color="primary"
        />
        <Chip
          size='small'
          label={
            <FormattedMessage
              id="account.profile.payments.chip.failed"
              defaultMessage="{failed} failed"
              values={{ failed }}
            />
          }
          color="error"
        />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default PaymentsDashboardCard;