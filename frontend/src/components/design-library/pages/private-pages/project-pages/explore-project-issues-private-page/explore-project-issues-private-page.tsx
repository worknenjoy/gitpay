import React from 'react'
import { ExplorePaper } from '../../issues-pages/explore-issues-private-page/explore-issues-private-page.styles'
import { Container } from '@mui/material'
import { TopSection } from './explore-project-issues-private-page.styles'
import { FormattedMessage } from 'react-intl'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import ContextTitle from 'design-library/atoms/typography/context-title/context-title'
import Breadcrumbs from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import ProjectIssuesTable from 'design-library/molecules/tables/project-issue-table/project-issue-table'

const ExploreProjectPage = ({
  project,
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
}) => {
  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumbs
            project={project}
            root={{
              label: (
                <FormattedMessage
                  id="breadcrumbs.root.explore.issues"
                  defaultMessage="Explore Issues"
                />
              ),
              link: '/profile/explore',
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
            context={project}
            title={
              <FormattedMessage id="projects.explore.project.issues" defaultMessage="Project" />
            }
          />
        </TopSection>
        <TopSection>
          <ProjectIssuesTable
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

export default ExploreProjectPage
