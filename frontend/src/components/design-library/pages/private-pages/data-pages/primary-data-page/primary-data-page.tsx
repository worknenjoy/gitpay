import React from 'react'
import { Button, Container, Paper } from '@mui/material'
import { AddRounded as AddIcon } from '@mui/icons-material'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'

const PrimaryDataPage = ({
  title,
  description,
  activeTab,
  tabs = [],
  emptyComponent = <EmptyBase />,
  displayAction = false,
  onActionClick = () => {},
  onActionText = <>Create New</>,
}) => {
  const currentActiveTab = tabs.find((tab) => tab.value === activeTab)
  const emptyActiveTab = currentActiveTab?.table.tableData.data.length === 0
  const activeTabCompleted = currentActiveTab?.table.tableData.completed || false
  const isEmpty = (emptyActiveTab || tabs.length === 0) && activeTabCompleted

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
      {isEmpty ? (
        <Paper sx={{ p: 2 }}>{emptyComponent}</Paper>
      ) : (
        <TabbedTable tabs={tabs} activeTab={activeTab} />
      )}
    </Container>
  )
}

export default PrimaryDataPage
