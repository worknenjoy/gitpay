import React from 'react';
import BaseTabs from '../base-tabs/base-tabs';

const ExploreTabs = ({ children }) => {

  const tabs = [
    { label: 'Issues', value: 'issues' },
    { label: 'Projects', value: 'projects' },
    { label: 'Organizations', value: 'organizations' },
  ];
  return (
    <>
      <BaseTabs
        tabs={tabs}
        activeTab='issues'
        withCard={false}
      >
        {children}
      </BaseTabs>
    </>
  );
};

export default ExploreTabs;