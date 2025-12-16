import React from 'react'
import { Button, Container, Skeleton } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import ShowMoreText from 'react-show-more-text'
import { marked } from 'marked'
import parse from 'html-react-parser'
import IssueHeader from '../../headers/issue-header/issue-header'
import IssueAuthorList from '../../lists/issue-author-list/issue-author-list'
import { DescriptionHeading, IssueContentText } from './issue-content.styles'

const IssueContent = ({
  user,
  updateTask,
  reportTask,
  onDeleteTask,
  task,
  messageAuthor
}) => {
  return (
    <Container fixed maxWidth="md" sx={{ mt: 2 }}>
      <IssueHeader
        task={task}
        user={user}
        updateTask={updateTask}
        reportTask={reportTask}
        handleDeleteTask={onDeleteTask}
      />
      <DescriptionHeading variant="subtitle1">
        <FormattedMessage id="task.info.description" defaultMessage="Description" />
      </DescriptionHeading>
      {!task.completed ? (
        <>
          <Skeleton variant="text" animation="wave" width="100%" />
          <Skeleton variant="text" animation="wave" width="100%" />
          <Skeleton variant="text" animation="wave" width="100%" />
          <Skeleton variant="text" animation="wave" width="100%" />
          <Skeleton variant="text" animation="wave" width="100%" />
        </>
      ) : (
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
            {task.data.description && parse(marked(task.data.description))}
          </ShowMoreText>
        </IssueContentText>
      )}
      <IssueAuthorList
        user={user}
        task={task}
        messageAuthor={messageAuthor}
        authors={[
          {
            name: task.data?.User?.name || 'anonymous',
            email: task.data?.User?.email,
            href: task.data?.User?.website
          }
        ]}
      />
    </Container>
  )
}
export default IssueContent
