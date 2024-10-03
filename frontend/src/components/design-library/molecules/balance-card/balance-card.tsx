import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardContent, CardActions, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 10,
    textAlign: 'right',
    padding: 10,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
  },
});

const BalanceCard = ({ name, balance, onAdd }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>
          {name}
        </Typography>
        <Typography className={classes.balance} color="primary">
          ${balance}
        </Typography>
      </CardContent>
      <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
          variant='contained'
          size='small'
          color='secondary'
          onClick={onAdd}
        >
          <FormattedMessage id="wallets.addFunds" defaultMessage="Add funds" />
        </Button>
      </CardActions>
    </Card>
  );
};

export default BalanceCard;
