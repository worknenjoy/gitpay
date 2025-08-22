import React from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles'
import PriceInput from '../../../../atoms/inputs/price-input/price-input';
import PlanCard from '../../../../molecules/cards/plan-card/plan-card';

type PricePlanProps = {
  price: number;
  plan?: any | undefined | null;
  onChange: any;
}

const useStyles = makeStyles(theme => ({
  planGrid: {
    '&.MuiGrid-root': {
      alignItems: 'center'
    }
  }
}))

const PricePlan = ({ price, plan, onChange }:PricePlanProps) => {
  const classes = useStyles();
  return (
    <Grid
      container
      spacing={0}
      className={classes.planGrid}
    >
      <Grid
        spacing={0}
        size={{ xs: 12, md: plan ? 4 : 12, lg: plan ? 4 : 12 }}
      >
        <PriceInput
          priceLabel="Price"
          value={price}
          onChange={onChange}
          defaultValue={0}
          currency="$"
          endAdornment={!!plan}
        />
      </Grid>
      {plan && 
        <Grid
          spacing={0}
          size={{ xs: 12, md: 8, lg: 8 }}
        >
          <PlanCard plan={plan} />
        </Grid>
      }
    </Grid>
  );
}

export default PricePlan