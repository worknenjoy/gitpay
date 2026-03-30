import React, { useState } from 'react'
import { Button, Container, Badge, Box } from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  History as HistoryIcon,
  Article as DescriptionIcon,
  Paid as PaidIcon
} from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import ShowMoreText from 'react-show-more-text'
import { marked } from 'marked'
import parse from 'html-react-parser'
import IssueHeader from '../../headers/issue-header/issue-header'
import IssueAuthorList from '../../lists/issue-author-list/issue-author-list'
import { IssueContentText } from './issue-content.styles'
import IssueContentPlaceholder from './issue-content-placeholder'
import IssueHistoryTimeline from '../issue-history-timeline/issue-history-timeline'
import IssuePaymentsList from 'design-library/molecules/lists/issue-payments-list/issue-payments-list'
import BaseTabs from 'design-library/molecules/tabs/base-tabs/base-tabs'

const IssueContent = ({ user, updateTask, reportTask, onDeleteTask, task, messageAuthor }) => {
  const { data, completed } = task
  const [activeTab, setActiveTab] = useState<string | number>(0)

  const histories = data?.histories || []
  const paidOrders = (data?.orders || data?.Orders)?.filter((o) => o.paid) || []

  const tabs = [
    {
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DescriptionIcon fontSize="small" />
          <FormattedMessage id="task.info.description" defaultMessage="Description" />
        </Box>
      ),
      value: 0
    },
    ...(paidOrders.length > 0
      ? [
          {
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PaidIcon fontSize="small" />
                <Badge badgeContent={paidOrders.length} color="default" max={99}>
                  <Box sx={{ pr: 1.5 }}>
                    <FormattedMessage id="issue.content.tab.payments" defaultMessage="Payments" />
                  </Box>
                </Badge>
              </Box>
            ),
            value: 2
          }
        ]
      : []),
    {
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <HistoryIcon fontSize="small" />
          <Badge badgeContent={histories.length} color="default" max={99}>
            <Box sx={{ pr: histories.length > 0 ? 1.5 : 0 }}>
              <FormattedMessage id="task.info.history" defaultMessage="History" />
            </Box>
          </Badge>
        </Box>
      ),
      value: 1
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
      />

      <BaseTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        withCard={false}
      >
        {activeTab == 0 ? (
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
        ) : activeTab == 1 ? (
          <IssueHistoryTimeline histories={histories} />
        ) : (
          <IssuePaymentsList orders={paidOrders} />
        )}
      </BaseTabs>

      <IssueAuthorList
        user={user}
        task={task}
        messageAuthor={messageAuthor}
        authors={[
          {
            name: data?.User?.name || 'anonymous',
            email: data?.User?.email,
            href: data?.User?.website
          }
        ]}
      />
    </Container>
  ) : (
    <IssueContentPlaceholder />
  )
}

export default IssueContent
