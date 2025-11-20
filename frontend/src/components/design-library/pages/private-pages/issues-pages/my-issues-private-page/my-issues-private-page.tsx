import React from 'react'
import {
  issueMetadata,
  customColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import { Container } from '@mui/material'
import {
  ExplorePaper,
  TopSection
} from '../explore-issues-private-page/explore-issues-private-page.styles'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import useMyIssueTabs from '../../../../../../hooks/use-my-issues-tabs'
import { FormattedMessage } from 'react-intl'

const MyIssuesPrivatePage = ({ user, issues }) => {
  const issueTableData = {
    tableData: issues,
    tableHeaderMetadata: issueMetadata,
    customColumnRenderer: customColumnRenderer
  }

  const { currentTabs, activeTab } = useMyIssueTabs({
    user,
    baseLink: '/profile/tasks',
    issueTableData
  })

  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumbs
            root={{
              label: <FormattedMessage id="breadcrumbs.root.my.issues" defaultMessage="My Issues" />
            }}
          />
        </TopSection>
        <TopSection>
          <MainTitle
            title="My Issues"
            subtitle="Here you can see issues imported or that you're working on"
          />
        </TopSection>
        <TopSection>
          <TabbedTable tabs={currentTabs} activeTab={activeTab} />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default MyIssuesPrivatePage
