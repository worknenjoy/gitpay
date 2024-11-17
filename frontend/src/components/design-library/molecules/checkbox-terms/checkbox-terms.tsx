import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, FormControlLabel, Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TermsDialog from './terms-dialog';
// import { on } from 'events';

const useStyles = makeStyles(() => ({
  termsLabel: {
    paddingTop: 0,
  },
  checkbox: {
    paddingRight: 5,
  },
}));

const CheckboxTerms = ({ onAccept }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const [ openTerms, setOpenTerms ] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onAccept();
  };

  return (
    <Grid item xs={12} className={classes.termsLabel}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              color='primary'
              className={classes.checkbox}
            />
          }
          onClick={handleChange}
          label={<Typography variant='caption' >
            <FormattedMessage id='task.bounties.interested.termsOfUseLabel' defaultMessage='I AGREE WITH THE {termsOfUseAnchor} AND THE CONFIDENTIALITY OF INFORMATION' values={{
              termsOfUseAnchor: (
                <Link onClick={() => setOpenTerms(true)}>
                  <FormattedMessage id='task.bounties.interested.termsOfUse' defaultMessage='TERMS OF USE' />
                </Link>
              )
            }} />
          </Typography>}
        />
        <TermsDialog
          open={openTerms}
          onClose={() => setOpenTerms(false) } onAccept={() => setChecked(true)} onDisagree={() => setChecked(false)}
        />
      </Grid>
  );
};

export default CheckboxTerms;