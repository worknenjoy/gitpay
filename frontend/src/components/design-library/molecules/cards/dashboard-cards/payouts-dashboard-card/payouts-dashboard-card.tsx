import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './payouts-dashboard-card.styles';
import payoutIcon from 'images/icons/noun_project management_3063542.svg';

const PayoutsDashboardCard = ({
  payouts = 0,
  completed = 0,
  pending = 0,
}) => {
  return (
    <DashboardCardBase
      image={payoutIcon}
      title={<FormattedMessage id="account.profile.payouts.headline" defaultMessage="Payouts" />}
      subheader={<FormattedMessage id="account.profile.payouts.overview" defaultMessage="{payouts} payouts" values={{ payouts }} />}
      buttonText={<FormattedMessage id="account.profile.payouts.buttonText" defaultMessage="See payouts" />}
      buttonLink="/profile/payouts"
    >
      <DashboardCardChipList>
        <Chip size='small' label={<FormattedMessage id="account.profile.payouts.chip.completed" defaultMessage="{completed} completed" values={{ completed }} />} color="success" />
        <Chip size='small' label={<FormattedMessage id="account.profile.payouts.chip.pending" defaultMessage="{pending} pending" values={{ pending }} />} color="warning" />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default PayoutsDashboardCard;