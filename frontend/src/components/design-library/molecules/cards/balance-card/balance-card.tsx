import React from 'react';
import { Button, Card, CardContent, CardActions, Typography, makeStyles } from '@material-ui/core';
import ReactPlaceholder from 'react-placeholder';

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
  completed?: boolean;
}

const BalanceCard = ({ name, balance, currency = 'USD', onAdd, action, completed }: BalanceCardProps) => {
  const classes = useStyles();

  return (

    <Card className={classes.root}>
      <CardContent>
        <ReactPlaceholder
          showLoadingAnimation={true}
          type="text"
          ready={completed}
          rows={2}
        >
          <Typography className={classes.name} color="textSecondary" gutterBottom>
            {name}
          </Typography>
          <Typography className={classes.balance} color="primary">
            {currency} {balance}
          </Typography>
        </ReactPlaceholder>
      </CardContent>
      {onAdd && action && (
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
