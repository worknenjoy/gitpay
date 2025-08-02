import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Button, Card, CardContent, CardActions, Typography, makeStyles } from '@material-ui/core';
import currencyMap from './currency-map';


//Function to convert currency code to symbol
function currencyCodeToSymbol(code) {
  return currencyMap[code.toLowerCase()] || code;
}

//Function to format amount from cents to decimal format
export function formatStripeAmount(amountInCents) {
  // Convert to a number in case it's a string
  let amount = Number(amountInCents);

  // Check if the conversion result is a valid number
  if (isNaN(amount)) {
    return 'Invalid amount';
  }

  // Convert cents to a decimal format and fix to 2 decimal places
  return (amount / 100).toFixed(2);
}

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
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
  actionProps?: any;
  completed?: boolean;
}

const BalanceCard = ({ name, balance, currency = 'USD', onAdd, action, actionProps,completed }: BalanceCardProps) => {
  const classes = useStyles();

  const convertedBalance = `${currencyCodeToSymbol(currency)} ${formatStripeAmount(balance)}`

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
            {convertedBalance}
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
            {...actionProps}
          >
            {action}
          </Button>
        </CardActions>
      )}

    </Card>

  );
};

export default BalanceCard;
