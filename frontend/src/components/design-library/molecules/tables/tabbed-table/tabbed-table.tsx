import BaseTabs from 'design-library/molecules/tabs/base-tabs/base-tabs';
import React, { useEffect } from 'react';
import SectionTable from '../section-table/section-table';

const TabbedTable = ({ tabs, activeTab }) => {
  const [ currentTab, setCurrentTab ] = React.useState(tabs.find(tab => tab.value === activeTab) || tabs[0]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(tabs.find(tab => tab.value === newValue));
  };

  useEffect(() => {
    if (activeTab) {
      const activeTabData = tabs.find(tab => tab.value === activeTab);
      if (activeTabData) {
        setCurrentTab(activeTabData);
      }
    }
  }, [activeTab, tabs]);

  const { label, value, table } = currentTab || {};
  const { tableData, tableHeaderMetadata, customColumnRenderer } = table || { tableData: { data: [] }, tableHeaderMetadata: [], customColumnRenderer: {} };

  return (
    <BaseTabs
      activeTab={value} // Set the first tab as active by default
      tabs={tabs}
      onChange={handleTabChange}
      withCard={false} // Use withCard prop to wrap content in a card
    >
      <SectionTable
        key={value}
        tableData={tableData}
        tableHeaderMetadata={tableHeaderMetadata}
        customColumnRenderer={customColumnRenderer}
      />
    </BaseTabs>
  );
};

export default TabbedTable;
