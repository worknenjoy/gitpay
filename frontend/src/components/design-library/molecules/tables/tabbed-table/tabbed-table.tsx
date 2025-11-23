import BaseTabs from 'design-library/molecules/tabs/base-tabs/base-tabs'
import React, { useEffect } from 'react'
import SectionTable from '../section-table/section-table'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import { TableTabsProps } from 'types/table'

type TabbedTableProps = {
  tabs: Array<TableTabsProps>
  activeTab?: string
  onChange?: (newValue: string) => void
}

const TabbedTable = ({ tabs, activeTab, onChange }: TabbedTableProps) => {
  const [currentTab, setCurrentTab] = React.useState(
    tabs.find((tab) => tab.value === activeTab) || tabs[0]
  )

  const handleTabChange = (event, newValue) => {
    setCurrentTab(tabs.find((tab) => tab.value === newValue))
    onChange?.(newValue)
  }

  useEffect(() => {
    if (activeTab) {
      const activeTabData = tabs.find((tab) => tab.value === activeTab)
      if (activeTabData) {
        setCurrentTab(activeTabData)
      }
    }
  }, [activeTab, tabs])

  const { label, value, table } = currentTab || {}
  const { tableData, tableHeaderMetadata, customColumnRenderer } = table || {
    tableData: { data: [] },
    tableHeaderMetadata: [],
    customColumnRenderer: {}
  }

  return (
    <BaseTabs
      activeTab={value} // Set the first tab as active by default
      tabs={tabs}
      onChange={handleTabChange}
      withCard={false} // Use withCard prop to wrap content in a card
    >
      {currentTab?.cards?.length > 0 && (
        <div
          style={{ display: 'flex', gap: '16px', marginBottom: '16px', justifyContent: 'flex-end' }}
        >
          {currentTab.cards.map((card, index) => (
            <BalanceCard key={index} name={card.title} balance={card.amount} type={card.type} />
          ))}
        </div>
      )}
      <SectionTable
        key={value}
        tableData={tableData}
        tableHeaderMetadata={tableHeaderMetadata}
        customColumnRenderer={customColumnRenderer}
      />
    </BaseTabs>
  )
}

export default TabbedTable
