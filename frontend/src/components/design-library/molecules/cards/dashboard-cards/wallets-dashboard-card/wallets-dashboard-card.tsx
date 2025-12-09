import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './wallets-dashboard-card.styles';
import { formatCurrency } from '../../../../../../utils/format-currency'
import walletIcon from 'images/icons/noun_project management_3063515.svg';

const WalletsDashboardCard = ({
  wallets
}) => {
  const { total = 0, data = [], balance = 0 } = wallets || {};
  return (
    <DashboardCardBase
      image={walletIcon}
      title={<FormattedMessage id="account.profile.wallets.headline" defaultMessage="Wallets" />}
      subheader={
        <FormattedMessage
          id="account.profile.wallets.overview"
          defaultMessage="{total} wallets created"
          values={{ total: total || 0 }}
        />
      }
      buttonText={<FormattedMessage id="account.profile.wallets.buttonText" defaultMessage="Manage wallets" />}
      buttonLink="/profile/wallets"
    >
      <DashboardCardChipList>
        <Chip 
          size='small'
          label={
            <FormattedMessage 
              id="account.profile.wallets.chip.balance"
              defaultMessage="{name} balance: {balance}"
              values={{ name: data[0]?.name, balance: formatCurrency(balance) }}
            />
          }
          color="info"
        />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default WalletsDashboardCard;