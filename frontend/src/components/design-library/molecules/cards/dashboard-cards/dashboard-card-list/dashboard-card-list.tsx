import React from 'react';
import useUserTypes from '../../../../../../hooks/use-user-types';
import MyIssuesDashboardCard from '../my-issues-dashboard-card/my-issues-dashboard-card';
import PaymentsDashboardCard from '../payments-dashboard-card/payments-dashboard-card';
import WalletsDashboardCard from '../wallets-dashboard-card/wallets-dashboard-card';
import PaymentRequestsDashboardCard from '../payment-requests-dashboard-card/payment-requests-dashboard-card';
import ClaimsDashboardCard from '../claims-dashboard-card/claims-dashboard-card';
import BankAccountDashboardCard from '../bank-account-dashboard-card/bank-account-dashboard-card';
import PayoutsDashboardCard from '../payouts-dashboard-card/payouts-dashboard-card';
import DashboardCardListPlaceholder from './dashboard-card-list.placeholder';
import { CardList, ContentWrapper } from './dashboard-card-list.styles';

const DashboardCardList = ({
  user,
  info
}) => {
  const { completed } = user || {};
  const { isMaintainer, isFunding, isContributor } = useUserTypes({ user });
  const { completed: infoCompleted, data: infoData } = info || {};

  return (
    (completed && infoCompleted) ?
    <ContentWrapper>
      <CardList>
        {isMaintainer && (
          <>
            <MyIssuesDashboardCard 
              issues={infoData.activeIssues}
              closedIssues={infoData.closedIssues}
            />
            <WalletsDashboardCard />
          </>
        )}
        {(isMaintainer || isFunding) && (
          <PaymentsDashboardCard />
        )}
        {isContributor && (
          <>
            <PaymentRequestsDashboardCard />
            <ClaimsDashboardCard />
            <BankAccountDashboardCard />
            <PayoutsDashboardCard />
          </>
        )}
      </CardList>
    </ContentWrapper> :
    <DashboardCardListPlaceholder />
  );
};

export default DashboardCardList;