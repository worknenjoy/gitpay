import React from 'react';
import { Typography } from '@mui/material';
import useStyles from './fieldset.styles';
import ReactPlaceholder from 'react-placeholder';

const Fieldset = ({ children, completed, legend, rows = 1 }) => {
  const classes = useStyles();
  return (
    <fieldset className={classes.fieldset}>
      <legend className={classes.legend}>
        <Typography>
          {legend}
        </Typography>
      </legend>
      <ReactPlaceholder
        showLoadingAnimation
        type="text"
        rows={rows}
        ready={completed}
        lineSpacing={24}
        className={classes.placeholder}
      >
        {children}
      </ReactPlaceholder>
    </fieldset>
  );
}

export default Fieldset;