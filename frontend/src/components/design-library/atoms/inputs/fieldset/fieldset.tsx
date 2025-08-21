import React from 'react';
import { Typography, Skeleton } from '@mui/material';
import useStyles from './fieldset.styles';

const Fieldset = ({ children, completed, legend }) => {
  const classes = useStyles();
  return (
    <fieldset className={classes.fieldset}>
      <legend className={classes.legend}>
        <Typography>
          {legend}
        </Typography>
      </legend>
      {
        !completed ? (
          <Skeleton variant="text" animation="wave" width="100%" />
        ) : (
          children
        )
      }
    </fieldset>
  );
}

export default Fieldset;