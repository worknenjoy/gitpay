import React, { useState } from 'react'
import { Button, Container, Badge, Box } from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  History as HistoryIcon,
  Article as DescriptionIcon
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import ShowMoreText from 'react-show-more-text'
import { marked } from 'marked'
import parse from 'html-react-parser'
import IssueHeader from '../../headers/issue-header/issue-header'
import { IssueContentText } from './issue-content.styles'
import IssueContentPlaceholder from './issue-content-placeholder'
import IssueHistoryTimeline from '../issue-history-timeline/issue-history-timeline'
import IssueSolutionsList, {
  IssueSolution
} from 'design-library/molecules/lists/issue-solutions-list/issue-solutions-list'
import PullRequestIcon from 'design-library/atoms/icons/pull-request-icon/pull-request-icon'
import type { LinkedPullRequest } from 'design-library/molecules/menus/linked-pull-requests-menu/linked-pull-requests-menu'
import BaseTabs from 'design-library/molecules/tabs/base-tabs/base-tabs'

type IssueContentProps = {
  user: any
  task: any
  updateTask: (data: any) => any
  reportTask: (...args: any[]) => void
  onDeleteTask: (data: any) => Promise<any>
  /** Opens the message dialog (Message button in the header). */
  onMessage?: () => void
  solutions?: IssueSolution[]
  onSendSolution?: () => void
  linkedPullRequests?: LinkedPullRequest[]
  linkedOpen?: boolean
}

const TAB_DESCRIPTION = 0
const TAB_HISTORY = 1
const TAB_SOLUTIONS = 2

const TabLabel = ({
  icon,
  count,
  children
}: {
  icon: React.ReactNode
  count?: number
  children: React.ReactNode
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {icon}
    <Badge badgeContent={count} color="default" max={99}>
      <Box sx={{ pr: count ? 1.5 : 0 }}>{children}</Box>
    </Badge>
  </Box>
)

const IssueContent = ({
  user,
  updateTask,
  reportTask,
  onDeleteTask,
  task,
  onMessage,
  solutions = [],
  onSendSolution,
  linkedPullRequests,
  linkedOpen
}: IssueContentProps) => {
  const { data, completed } = task
  const [activeTab, setActiveTab] = useState<string | number>(TAB_DESCRIPTION)

  const histories = data?.histories || []

  const tabs = [
    {
      label: (
        <TabLabel icon={<DescriptionIcon fontSize="small" />}>
          <FormattedMessage id="task.info.description" defaultMessage="Description" />
        </TabLabel>
      ),
      value: TAB_DESCRIPTION
    },
    {
      label: (
        <TabLabel icon={<PullRequestIcon fontSize="small" />} count={solutions.length}>
          <FormattedMessage id="issue.content.tab.solutions" defaultMessage="Solutions" />
        </TabLabel>
      ),
      value: TAB_SOLUTIONS
    },
    {
      label: (
        <TabLabel icon={<HistoryIcon fontSize="small" />} count={histories.length}>
          <FormattedMessage id="issue.content.tab.activity" defaultMessage="Activity" />
        </TabLabel>
      ),
      value: TAB_HISTORY
    }
  ]

  return completed ? (
    <Container fixed maxWidth="md" sx={{ mt: 2 }}>
      <IssueHeader
        task={task}
        user={user}
        updateTask={updateTask}
        reportTask={reportTask}
        handleDeleteTask={onDeleteTask}
        onMessage={onMessage}
        linkedPullRequests={linkedPullRequests}
        linkedOpen={linkedOpen}
      />

      <BaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        withCard={false}
      >
        {activeTab == TAB_DESCRIPTION ? (
          <IssueContentText variant="body1">
            <ShowMoreText
              lines={8}
              more={
                <Button size="small" variant="outlined">
                  <FormattedMessage id="task.description.more" defaultMessage="Show more" />
                  <ExpandMore />
                </Button>
              }
              less={
                <Button size="small" variant="outlined">
                  <FormattedMessage id="task.description.less" defaultMessage="Show less" />
                  <ExpandLess />
                </Button>
              }
            >
              {data.description && parse(marked(data.description))}
            </ShowMoreText>
          </IssueContentText>
        ) : activeTab == TAB_SOLUTIONS ? (
          <Box sx={{ mt: 2 }}>
            <IssueSolutionsList solutions={solutions} onSendSolution={onSendSolution} />
          </Box>
        ) : (
          <IssueHistoryTimeline histories={histories} />
        )}
      </BaseTabs>
    </Container>
  ) : (
    <IssueContentPlaceholder />
  )
}

export default IssueContent
