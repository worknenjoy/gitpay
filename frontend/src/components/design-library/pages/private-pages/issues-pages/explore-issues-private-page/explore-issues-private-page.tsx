import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Container } from '@mui/material'
import { BugReportOutlined as NoIssuesIcon } from '@mui/icons-material'
import { ExplorePaper, TopSection } from './explore-issues-private-page.styles'
import IssuesTable from 'design-library/molecules/tables/issue-table/issue-table'
import MainTitle from 'design-library/atoms/typography/main-title/main-title'
import Breadcrumb from 'design-library/molecules/breadcrumbs/breadcrumb/breadcrumb'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import ImportIssueDialog from 'design-library/organisms/layouts/topbar-layouts/topbar-layout/import-issue-dialog'

const ExploreIssuesPrivatePage = ({
  filterTasks,
  listTasks,
  issues,
  labels,
  listLabels,
  languages,
  listLanguages,
  user = {},
  openAddIssue = false,
  onAddIssueClick,
  onCloseAddIssue,
  onCreateIssue
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
              )
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
            serverSidePagination
            emptyComponent={
              <>
                <EmptyBase
                  text={
                    <FormattedMessage id="issues.explore.empty" defaultMessage="No issues found" />
                  }
                  secondaryText={
                    <FormattedMessage
                      id="issues.explore.empty.secondary"
                      defaultMessage="There are no issues available to work on right now."
                    />
                  }
                  icon={<NoIssuesIcon fontSize="large" color="disabled" />}
                  actionText={
                    <FormattedMessage
                      id="issues.explore.empty.action"
                      defaultMessage="Import issue"
                    />
                  }
                  onActionClick={onAddIssueClick}
                />
                <ImportIssueDialog
                  open={openAddIssue}
                  onClose={onCloseAddIssue}
                  onCreate={onCreateIssue}
                  user={user}
                />
              </>
            }
          />
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default ExploreIssuesPrivatePage
