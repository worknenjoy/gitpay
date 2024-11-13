import React, { useState } from 'react';
import {
  Grid,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: 'Roboto',
    color: '#a9a9a9',
  },
  item: {
    paddingBottom: 0,
  },
  starterCheckbox: {
    // Add any specific styles for starterCheckbox if needed
  },
  termsLabel: {
    paddingTop: 0,
  },
  checkbox: {
    paddingRight: 5,
  },
}));


const Checkboxes = ({ checkboxes }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Grid container spacing={3} className={classes.container}>
      {checkboxes.map((checkbox, index) => (
        <Grid item xs={12} sm={6} className={classes.item}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked[checkbox.value]}
                onChange={handleChange}
                color='primary'
                className={classes.checkbox}
              />
            }
            label={checkbox.label}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Checkboxes;