import React from 'react';
import { Container } from '@mui/material';
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header';
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table';

const PrimaryDataPage = ({
  title,
  description,
  activeTab,
  tabs = []
  // Add other props as needed
}) => {
  return (
    <Container>
      <ProfileHeader
        title={title}
        subtitle={description}
      />
      <TabbedTable tabs={tabs} activeTab={activeTab} />
    </Container>
  );
};

export default PrimaryDataPage;