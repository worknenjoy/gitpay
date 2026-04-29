import React from 'react'
import { Container } from '@mui/material'
import { AddOutlined as AddIcon } from '@mui/icons-material'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import Button from 'design-library/atoms/buttons/button/button'
import { TableTabsProps, TableTabsContentProps } from 'types/table'
import { CardProps } from 'types/card'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import { CardsWrapper } from './primary-data-page.styles'

type PrimaryPageProps = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  activeTab?: string
  tabs?: Array<TableTabsProps>
  table?: TableTabsContentProps
  cards?: Array<CardProps>
  emptyComponent?: React.ReactNode
  displayAction?: boolean
  onActionClick?: () => void
  onActionText?: React.ReactNode
}

const PrimaryDataPage = ({
  title,
  description,
  activeTab,
  tabs = [],
  table,
  cards = [],
  emptyComponent = <EmptyBase />,
  displayAction = false,
  onActionClick = () => {},
  onActionText = <>Create New</>
}: PrimaryPageProps) => {
  const currentActiveTab = tabs.find((tab) => tab.value === activeTab)
  const emptyActiveTab = currentActiveTab?.table.tableData.data.length === 0
  const activeTabCompleted = currentActiveTab?.table.tableData.completed || false
  const isEmpty = (emptyActiveTab || tabs.length === 0) && activeTabCompleted
  const isSingleTableEmpty = table?.tableData.data.length === 0 && table?.tableData.completed

  return (
    <Container>
      <ProfileHeader
        title={title}
        subtitle={description}
        aside={
          displayAction ? (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onActionClick}
              endIcon={<AddIcon fontSize="small" />}
              sx={{
                marginTop: { xs: 2, sm: 0 },
                height: 32,
                minHeight: 28,
                py: 2,
                px: 2
              }}
            >
              {onActionText}
            </Button>
          ) : null
        }
      />
      {isEmpty || isSingleTableEmpty ? (
        emptyComponent
      ) : table ? (
        <>
          {cards?.length > 0 && (
            <CardsWrapper>
              {cards.map((card, index) => (
                <BalanceCard key={index} name={card.title} balance={card.amount} type={card.type} />
              ))}
            </CardsWrapper>
          )}
          <SectionTable
            transparent
            tableData={table.tableData}
            tableHeaderMetadata={table.tableHeaderMetadata}
            customColumnRenderer={table.customColumnRenderer}
          />
        </>
      ) : (
        <TabbedTable tabs={tabs} activeTab={activeTab} />
      )}
    </Container>
  )
}

export default PrimaryDataPage
