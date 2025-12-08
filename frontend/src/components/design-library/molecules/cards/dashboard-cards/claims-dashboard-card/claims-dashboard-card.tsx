import React from 'react';
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base';
import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material';
import { DashboardCardChipList } from './claims-dashboard-card.styles';
import claimIcon from 'images/icons/noun_project management_3063514.svg';

const ClaimsDashboardCard = ({
  claims = 0,
  open = 0,
  resolved = 0,
}) => {
  return (
    <DashboardCardBase
      image={claimIcon}
      title={<FormattedMessage id="account.profile.claims.headline" defaultMessage="Claims" />}
      subheader={<FormattedMessage id="account.profile.claims.overview" defaultMessage="{claims} claims filed" values={{ claims }} />}
      buttonText={<FormattedMessage id="account.profile.claims.buttonText" defaultMessage="View claims" />}
      buttonLink="/profile/claims"
    >
      <DashboardCardChipList>
        <Chip size='small' label={<FormattedMessage id="account.profile.claims.chip.open" defaultMessage="{open} open" values={{ open }} />} color="warning" />
        <Chip size='small' label={<FormattedMessage id="account.profile.claims.chip.resolved" defaultMessage="{resolved} resolved" values={{ resolved }} />} color="success" />
      </DashboardCardChipList>
    </DashboardCardBase>
  );
};

export default ClaimsDashboardCard;