import React from 'react';
import { Button, Container, Skeleton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import ShowMoreText from 'react-show-more-text'
import { marked } from 'marked'
import parse from 'html-react-parser';
import IssueHeader from '../../../molecules/headers/issue-header/issue-header';
import IssueAuthorList from '../../../molecules/lists/issue-author-list/issue-author-list';
import { DescriptionHeading, IssueContentText } from './issue-content.styles';

const IssueContent = ({ className, user, project, organization, updateTask, reportTask, onDeleteTask, logged, task, messageAuthor }) => {
  const taskOwner = () => {
    const creator = logged && task.data.User && user.id === task.data.User.id
    const owner = (task.data.members && task.data.members.length) ? task.data.members.filter(m => m.User.id === user.id).length > 0 : false
    return creator || owner
  }

  return (
    <Container fixed maxWidth="lg">
      <IssueHeader
        task={task}
        user={user}
        project={project}
        organization={organization}
        updateTask={updateTask}
        taskOwner={taskOwner()}
        reportTask={reportTask}
        handleDeleteTask={onDeleteTask}
      />
    <DescriptionHeading variant="subtitle1">
        <FormattedMessage id="task.info.description" defaultMessage="Description" />
    </DescriptionHeading>
      <Skeleton variant="text" width="100%" height={118} animation="wave" />
      {
        !task.completed ? (
          <>
            <Skeleton variant="text" animation="wave" width="100%" />
            <Skeleton variant="text" animation="wave" width="100%" />
            <Skeleton variant="text" animation="wave" width="100%" />
            <Skeleton variant="text" animation="wave" width="100%" />
            <Skeleton variant="text" animation="wave" width="100%" />
          </>
        ) : (
      <IssueContentText variant="body1" className={className}>
            <ShowMoreText
              lines={8}
              more={
                <Button
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="task.description.more" defaultMessage="Show more" />
                  <ExpandMore />
                </Button>
              }
              less={
                <Button
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="task.description.less" defaultMessage="Show less" />
                  <ExpandLess />
                </Button>
              }
            >
              {task.data.description && parse(marked(task.data.description))}
            </ShowMoreText>

      </IssueContentText>
        )
      }
      <IssueAuthorList
        logged={logged}
        user={user}
        task={task}
        messageAuthor={messageAuthor}
        authors={
          [
            {
              name: task.data?.User?.name || 'anonymous',
              email: task.data?.User?.email,
              href: task.data?.User?.website
            }
          ]
        } />
    </Container>
  );
}
export default IssueContent;