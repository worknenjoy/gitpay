import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from '@mui/material'
import { ExplorePaper, TopSection } from './explore-issues-private-page.styles'
import IssuesTable from 'design-library/molecules/tables/issue-table/issue-table'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import Breadcrumb from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'

const ExploreIssuesPrivatePage = ({
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  user,
}) => {
  return (
    <ExplorePaper elevation={0}>
      <Container>
        <TopSection>
          <Breadcrumb
            root={{
              label: (
                <FormattedMessage
                  id="breadcrumb.root.profile.explore"
                  defaultMessage="Explore Issues"
                />
              ),
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

export default ExploreIssuesPrivatePage
