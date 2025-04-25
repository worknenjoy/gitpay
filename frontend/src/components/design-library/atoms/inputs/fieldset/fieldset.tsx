import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactPlaceholder from 'react-placeholder';

const useStyles = makeStyles((theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    margin: '16px 0',
  }
}));

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
        type='text'
        rows={rows}
        ready={completed}
        lineSpacing={24}
        style={{ width: '95%', padding: 12 }}
      >
        {children}
      </ReactPlaceholder>
    </fieldset>
  );
}

export default Fieldset;