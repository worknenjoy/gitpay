import React from 'react';
import { Grid } from '@mui/material';
import IssueContent from 'design-library/molecules/content/issue-content/issue-content';

const IssuePage = ({ logged, task, project, organization, onDeleteTask, user, updateTask, reportTask, messageAuthor }) => {
  return (
    <Grid container style={{ marginBottom: 4 }} alignItems="stretch">
      <Grid size={{ xs: 12, sm: 12, md: 8 }} style={{ marginBottom: 40 }}>
        <IssueContent
          logged={logged?.data?.id}
          task={task}
          project={project}
          user={user}
          updateTask={updateTask}
          reportTask={reportTask}
          messageAuthor={messageAuthor}
          organization={organization}
          onDeleteTask={onDeleteTask}
        />
      </Grid>
    </Grid>
  );
}

export default IssuePage;
