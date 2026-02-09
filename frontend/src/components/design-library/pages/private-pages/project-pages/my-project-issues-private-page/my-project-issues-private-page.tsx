import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import {
  useIssueMetadata,
  customColumnRenderer
} from 'design-library/molecules/tables/project-issue-table/project-issue-table'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import { Container } from '@mui/material'
import { ExplorePaper, TopSection } from './my-project-issues-private-page.styles'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import useMyIssueTabs from '../../../../../../hooks/use-my-issues-tabs'

const MyProjectIssuesPrivatePage = ({ project, user, issues }) => {
  const { project_id, organization_id } = useParams<{
    project_id: string
    organization_id: string
  }>()

  const issueMetadata = useIssueMetadata({ includeProject: false })

  const issueTableData = {
    tableData: issues,
    tableHeaderMetadata: issueMetadata,
    customColumnRenderer: customColumnRenderer
  }

  const baseLink = `/profile/organizations/${organization_id}/projects/${project_id}`

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
            project={project}
            root={{
              label: (
                <FormattedMessage
                  id="breadcrumbs.root.my.project.issues"
                  defaultMessage="My issues"
                />
              ),
              link: '/profile/tasks'
            }}
          />
        </TopSection>
        <TopSection>
          <MainTitle
            title={<FormattedMessage id="myIssues.title" defaultMessage="My Issues" />}
            subtitle={<FormattedMessage id="myIssues.subtitle" defaultMessage="Here you can see issues imported or that you're working on" />}
          />
        </TopSection>
        <TopSection>
          <ContextTitle
            context={project}
            title={
              <FormattedMessage id="projects.explore.project.issues" defaultMessage="Project" />
            }
          />
        </TopSection>
        <TopSection>
          <TabbedTable tabs={currentTabs} activeTab={activeTab} />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default MyProjectIssuesPrivatePage
