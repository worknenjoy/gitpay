import React, { useMemo } from 'react'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import { issueMetadata, customColumnRenderer } from 'design-library/molecules/tables/issue-table/issue-table'
import useUserTypes from '../../../../../../hooks/use-user-types'
import { Container } from '@mui/material'
import { TopSection, ExplorePaper } from './my-issues-private-page.styles'

const MyIssuesPrivatePage = ({ user, issues }) => {
  const { isContributor, isMaintainer, isFunding } = useUserTypes({ user })

  const issueTableData = {
    tableData: issues,
    tableHeaderMetadata: issueMetadata,
    customColumnRenderer: customColumnRenderer
  }

  const myIssuesTab = {
    label: 'My imported issues',
    value: 'createdbyme',
    link: '/profile/tasks/createbyme',
    table: issueTableData
  }

  const workingTabs = {
    label: 'Issues I\'m working on',
    value: 'assigned',
    link: '/profile/tasks/assigned',
    table: issueTableData
  }

  const followingTabs = {
    label: 'Following',
    value: 'interested',
    link: '/profile/tasks/interested',
    table: issueTableData
  }

  const currentTabs = [
    (isMaintainer || isFunding) && myIssuesTab,
    isContributor && workingTabs,
    isContributor && followingTabs
  ]

  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <MainTitle
            title="My Issues"
            subtitle="Here you can see issues imported or that you're working on"
          />
        </TopSection>
        <TopSection>
          <TabbedTable
            tabs={currentTabs}
            activeTab={(isMaintainer || isFunding) ? 'createdbyme' : 'assigned'}
          />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default MyIssuesPrivatePage