import React from 'react'
import { Button, Container, Paper } from '@mui/material'
import { AddRounded as AddIcon } from '@mui/icons-material'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import { TableTabsProps, TableTabsContentProps } from 'types/table'

type PrimaryPageProps = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  activeTab?: string
  tabs?: TableTabsProps
  table?: TableTabsContentProps
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
              endIcon={<AddIcon />}
            >
              {onActionText}
            </Button>
          ) : null
        }
      />
      {(isEmpty || isSingleTableEmpty) ? (
        <Paper sx={{ p: 2 }}>{emptyComponent}</Paper>
      ) : table ? (
        <SectionTable
          tableData={table.tableData}
          tableHeaderMetadata={table.tableHeaderMetadata}
          customColumnRenderer={table.customColumnRenderer}
        />
      ) : (
        <TabbedTable tabs={tabs} activeTab={activeTab} />
      )}
    </Container>
  )
}

export default PrimaryDataPage
