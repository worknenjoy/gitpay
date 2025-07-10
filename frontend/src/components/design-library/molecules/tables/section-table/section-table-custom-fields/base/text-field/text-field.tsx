import React from 'react';
import { Typography } from '@material-ui/core';

const TextField = ({
  title
}) => {
  return (
    <Typography variant="body1" color="textPrimary" gutterBottom>
      {title}
    </Typography>
  );
}

export default TextField;