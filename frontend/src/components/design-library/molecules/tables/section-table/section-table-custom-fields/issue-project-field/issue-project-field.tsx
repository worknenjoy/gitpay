import { Typography, Chip, Link } from '@material-ui/core';
import React from 'react';

const IssueProjectField = ({ issue }) => {
  const { Project: project } = issue;
  if(!project?.id) return <Typography variant='caption'>no project</Typography>
    const { id, name, OrganizationId } = project
    const url = '/profile/organizations/' + OrganizationId + '/projects/' + id
    return(
      <Chip label={project ? name : 'no project'} component={Link} href={'/#' + url} clickable />
    )
};

export default IssueProjectField;