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
  dashboard
}) => {
  const { completed } = user || {};
  const { isMaintainer, isFunding, isContributor } = useUserTypes({ user });
  const { completed: dashboardCompleted, data: dashboardData } = dashboard || {};

  return (
    (completed && dashboardCompleted) ?
    <ContentWrapper>
      <CardList>
        {isMaintainer && (
          <MyIssuesDashboardCard 
            issues={dashboardData.issues}
          />
        )}
         {(isMaintainer || isFunding) && (
          <>
            <PaymentsDashboardCard
              payments={dashboardData.payments}
            />
            <WalletsDashboardCard
              wallets={dashboardData.wallets}
            />
          </>
        )}
        {isContributor && (
          <>
            <PaymentRequestsDashboardCard
              paymentRequests={dashboardData.paymentRequests}
            />
            <ClaimsDashboardCard
              claims={dashboardData.claims}
            />
            { Object.keys(dashboardData.payouts).map((key, index) => (
              <PayoutsDashboardCard
                payouts={{...dashboardData.payouts[key], currency: key}}
                key={index}
              />
            ))}
          </>
        )}
      </CardList>
    </ContentWrapper> :
    <DashboardCardListPlaceholder />
  );
};

export default DashboardCardList;