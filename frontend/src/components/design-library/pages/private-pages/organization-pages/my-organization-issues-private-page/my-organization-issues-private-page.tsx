import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import {
  issueMetadata,
  customColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import { Container } from '@mui/material'
import { ExplorePaper, TopSection } from './my-organization-issues-private-page.styles'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import ProjectListCompact from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact'
import useMyIssueTabs from '../../../../../../hooks/use-my-issues-tabs'

const MyOrganizationIssuesPrivatePage = ({ organization, user, issues }) => {
  const { organization_id } = useParams<{ organization_id: string }>()

  const { data, completed } = organization
  const projectList = { data: data?.Projects || [], completed }

  const issueTableData = {
    tableData: issues,
    tableHeaderMetadata: issueMetadata,
    customColumnRenderer: customColumnRenderer
  }

  const baseLink = `/profile/organizations/${organization_id}`

  const { currentTabs, activeTab } = useMyIssueTabs({
    user,
    baseLink,
    issueTableData
  })

  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumbs
            organization={organization}
            root={{
              label: (
                <FormattedMessage
                  id="breadcrumbs.root.my.organization.issues"
                  defaultMessage="My issues"
                />
              ),
              link: '/profile/tasks'
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
          <ContextTitle
            context={organization}
            title={
              <FormattedMessage id="profile.my.organization.issues" defaultMessage="Organization" />
            }
          />
        </TopSection>
        <TopSection>
          <ProjectListCompact projects={projectList} />
        </TopSection>
        <TopSection>
          <TabbedTable tabs={currentTabs} activeTab={activeTab} />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default MyOrganizationIssuesPrivatePage
