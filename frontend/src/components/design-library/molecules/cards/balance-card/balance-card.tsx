import React from 'react';
import { Button, Card, CardContent, CardActions, Typography, Skeleton, styled } from '@mui/material';
import currencyMap from './currency-map';


//Function to convert currency code to symbol
export function currencyCodeToSymbol(code) {
  return currencyMap[code.toLowerCase()].symbol || code;
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

export const convertStripeAmountByCurrency = (amount, currency) => {
  const places = currencyMap[currency.toLowerCase()].decimalPlaces || 2;
  return (amount / Math.pow(10, places)).toFixed(places);
};

const useStyles = styled({
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

const BalanceCard = ({ name, balance, currency = 'USD', onAdd, action, actionProps, completed }: BalanceCardProps) => {
  const classes = useStyles();

  const convertedBalance = `${currencyCodeToSymbol(currency)} ${convertStripeAmountByCurrency(balance, currency)}`

  return (

    <Card className={classes.root}>
      <CardContent>
        <Skeleton variant="text" animation="wave" height={40} width="80%" />
        <Skeleton variant="text" animation="wave" height={40} width="60%" />
        <Skeleton variant="rect" animation="wave" height={118} />
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
            {action}
          </Button>
        </CardActions>
      )}

    </Card>

  );
};

export default BalanceCard;
