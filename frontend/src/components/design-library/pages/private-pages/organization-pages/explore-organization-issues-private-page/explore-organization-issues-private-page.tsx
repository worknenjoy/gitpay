import React from 'react'
import { ExplorePaper } from '../../issues-pages/explore-issues-private-page/explore-issues-private-page.styles'
import { Container } from '@mui/material'
import { TopSection } from './explore-organization-issues-private-page.styles'
import { FormattedMessage } from 'react-intl'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import IssuesTable from 'design-library/molecules/tables/issue-table/issue-table'
import ProjectListCompact from 'design-library/molecules/lists/project-list/project-list-compact/project-list-compact'

const ExploreOrganizationIssuesPrivatePage = ({
  organization,
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  user
}) => {
  const { data, completed } = organization
  const projectList = { data: data?.Projects || [], completed }

  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumbs
            organization={organization}
            root={{
              label: (
                <FormattedMessage
                  id="breadcrumbs.root.explore.issues"
                  defaultMessage="Explore Issues"
                />
              ),
              link: '/profile/explore'
            }}
          />
        </TopSection>
        <TopSection>
          <MainTitle
            title={<FormattedMessage id="issues.explore.title" defaultMessage="Explore issues" />}
            subtitle={
              <FormattedMessage
                id="issues.explore.description"
                defaultMessage="Here you can see all the issues on our network"
              />
            }
          />
        </TopSection>
        <TopSection>
          <ContextTitle
            context={organization}
            title={
              <FormattedMessage
                id="projects.explore.organization.issues"
                defaultMessage="Organization"
              />
            }
          />
        </TopSection>
        <TopSection>
          <ProjectListCompact projects={projectList} />
        </TopSection>
        <TopSection>
          <IssuesTable
            issues={issues}
            filterTasks={filterTasks}
            labels={labels}
            languages={languages}
            listLabels={listLabels}
            listLanguages={listLanguages}
            listTasks={listTasks}
          />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default ExploreOrganizationIssuesPrivatePage
