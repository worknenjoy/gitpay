import React from 'react';
import useUserTypes from '../../../../../../hooks/use-user-types';
import MyIssuesDashboardCard from '../my-issues-dashboard-card/my-issues-dashboard-card';
import { CardList, ContentWrapper } from './dashboard-card-list.styles';

const DashboardCardList = ({
  user,
  activeIssues,
  closedIssues
}) => {
  const { isMaintainer } = useUserTypes({ user });

  return (
    <ContentWrapper>
      <CardList>
        {isMaintainer && (
          <MyIssuesDashboardCard 
            issues={activeIssues}
            closedIssues={closedIssues}
          />
        )}
      </CardList>
    </ContentWrapper>
  );
};

export default DashboardCardList;