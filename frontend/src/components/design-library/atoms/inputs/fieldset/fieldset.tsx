import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder';
import { countries } from 'src/reducers/accountReducer';

const useStyles = makeStyles((theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark,
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    marginBottom: 20
  }
}));

const Fieldset = ({ children, completed, legend }) => {
  const classes = useStyles();
  return (
    <fieldset className={classes.fieldset} style={{ height: 108, display: 'flex', alignItems: 'center' }}>
      <legend className={classes.legend}>
        <Typography>
          {legend}
        </Typography>
      </legend>
      <ReactPlaceholder
        showLoadingAnimation
        type='text'
        rows={1}
        ready={completed}
      >
        {children}
      </ReactPlaceholder>
    </fieldset>
  );
}

export default Fieldset;