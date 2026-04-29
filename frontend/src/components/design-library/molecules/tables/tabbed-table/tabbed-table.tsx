import BaseTabs from 'design-library/molecules/tabs/base-tabs/base-tabs'
import React, { useEffect } from 'react'
import SectionTable from '../section-table/section-table'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import { TableTabsProps } from 'types/table'

type ServerSidePaginationProps = {
  enabled: boolean
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onSortChange?: (sortBy: string, sortDirection: 'asc' | 'desc' | 'none') => void
}

type TabbedTableProps = {
  tabs: Array<TableTabsProps>
  activeTab?: string
  onChange?: (newValue: string) => void
  serverSidePagination?: ServerSidePaginationProps
}

const TabbedTable = ({ tabs, activeTab, onChange, serverSidePagination }: TabbedTableProps) => {
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
    tableData: { data: [], completed: false },
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
        transparent
        key={value}
        tableData={tableData}
        tableHeaderMetadata={tableHeaderMetadata}
        customColumnRenderer={customColumnRenderer}
        serverSidePagination={serverSidePagination}
      />
    </BaseTabs>
  )
}

export default TabbedTable
