import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardContent, CardActions, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 10,
    textAlign: 'right',
    padding: 10
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 18
  }
});

type BalanceCardProps = {
  name: string | React.ReactNode;
  balance: number;
  currency?: string;
  onAdd?: (e: any) => void;
  action?: React.PropsWithChildren<any>;
}

const BalanceCard = ({ name, balance, currency = 'USD', onAdd, action }:BalanceCardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>
          {name}
        </Typography>
        <Typography className={classes.balance} color="primary">
          {currency} {balance}
        </Typography>
      </CardContent>
      { onAdd && action && (
        <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button 
            variant="contained"
            size="small"
            color="secondary"
            onClick={onAdd}
          >
            {action}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default BalanceCard;
