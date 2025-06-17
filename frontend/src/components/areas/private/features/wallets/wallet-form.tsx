import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Paper } from '@material-ui/core';
import Typography from '@mui/material/Typography';

import { Field } from '../../../../design-library/atoms/inputs/fields/field/field';

const styles = (theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    marginBottom: 20
  }
})


const WalletForm = ({
  classes,
  value,
  onChange,
  onCreate
}) => {

  const handleCreateWallet = (e) => {
    e.preventDefault();
    onCreate();
  }

  return (
    <Paper elevation={ 1 } style={{padding: 20}}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={ 12 } md={ 12 }>
              <fieldset className={ classes.fieldset }>
                <legend className={ classes.legend }>
                  <Typography>
                    <FormattedMessage id="wallet.new.fieldset.title" defaultMessage="New wallet" />
                  </Typography>
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                    <FormattedMessage id="account.basic.name" defaultMessage="name">
                      { (msg) => (
                        <Field
                          onChange={ (e) => onChange(e.target.value) }
                          name="name"
                          label={ msg }
                          value={ value }
                        />
                      ) }
                    </FormattedMessage>
                  </Grid>
                  <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
                    <div style={{float: 'right'}}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={ handleCreateWallet }
                      >
                        <FormattedMessage id="account.wallet.actions.create" defaultMessage="Create Wallet" />
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </fieldset>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default withStyles(styles)(WalletForm);