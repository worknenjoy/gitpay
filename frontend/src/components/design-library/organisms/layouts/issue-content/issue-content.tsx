import React from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import ShowMoreText from 'react-show-more-text'
import { marked } from 'marked'
import parse from 'html-react-parser';
import IssueHeader from '../../../molecules/headers/issue-header/issue-header';
import IssueAuthorList from '../../../molecules/lists/issue-author-list/issue-author-list';

const IssueContent = ({ user, project, organization, updateTask, reportTask, logged, task, messageAuthor }) => {
  const taskOwner = () => {
    const creator = logged && task.data.User && user.id === task.data.User.id
    const owner = (task.data.members && task.data.members.length) ? task.data.members.filter(m => m.User.id === user.id).length > 0 : false
    return creator || owner
  }

  return (
    <Container fixed maxWidth='lg'>
      <IssueHeader
        task={task}
        user={user}
        project={project}
        organization={organization}
        updateTask={updateTask}
        taskOwner={taskOwner()}
        reportTask={reportTask}
        handleDeleteTask={() => { }}
      />
      <Typography variant='subtitle1' style={{ marginBottom: 10, marginTop: 20 }}>
        <FormattedMessage id='task.info.description' defaultMessage='Description' />
      </Typography>
      <ReactPlaceholder showLoadingAnimation type={'text'} rows={5} ready={task.completed}>
        <Typography variant='body1' style={{ marginBottom: 40 }}>
          <ShowMoreText
            lines={8}
            more={
              <Button
                size='small'
                variant='outlined'
              >
                <FormattedMessage id='task.description.more' defaultMessage='Show more' />
                <ExpandMore />
              </Button>
            }
            less={
              <Button
                size='small'
                variant='outlined'
              >
                <FormattedMessage id='task.description.less' defaultMessage='Show less' />
                <ExpandLess />
              </Button>
            }
          >
            {task.data.description && parse(marked(task.data.description))}
          </ShowMoreText>

        </Typography>
      </ReactPlaceholder>
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