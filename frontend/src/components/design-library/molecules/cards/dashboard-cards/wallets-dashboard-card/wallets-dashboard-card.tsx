import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './wallets-dashboard-card.styles';
import walletIcon from 'images/icons/noun_project management_3063515.svg';

const WalletsDashboardCard = ({
  wallets = 0,
  balance = 0,
  locked = 0,
}) => {
  return (
    <DashboardCardBase
      image={walletIcon}
      title={<FormattedMessage id="account.profile.wallets.headline" defaultMessage="Wallets" />}
      subheader={<FormattedMessage id="account.profile.wallets.overview" defaultMessage="{wallets} wallets available" values={{ wallets }} />}
      buttonText={<FormattedMessage id="account.profile.wallets.buttonText" defaultMessage="Manage wallets" />}
      buttonLink="/profile/wallets"
    >
      <DashboardCardChipList>
        <Chip size='small' label={<FormattedMessage id="account.profile.wallets.chip.balance" defaultMessage="Balance: {balance}" values={{ balance }} />} color="primary" />
        <Chip size='small' label={<FormattedMessage id="account.profile.wallets.chip.locked" defaultMessage="Locked: {locked}" values={{ locked }} />} color="warning" />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default WalletsDashboardCard;