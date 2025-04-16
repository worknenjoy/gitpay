import React from 'react';
import { Typography } from '@material-ui/core';

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div style={{marginBottom: 20}}>
      <Typography variant='h5' gutterBottom>
        { title }
      </Typography>
      <Typography variant='caption' gutterBottom>
        { subtitle }
      </Typography>
    </div>
  );
}

export default ProfileHeader;