import React from 'react';
import { Grid } from '@material-ui/core';
import PriceInput from '../../atoms/price-input/price-input';
import PlanCard from '../../molecules/plan-card/plan-card';

const PricePlan = ({ price, plan, onChange }) => {
  return (
    <Grid
      container
      spacing={0}
    >
      <Grid
        spacing={0}
        xs={12}
        md={plan ? 4 : 12}
        lg={plan ? 4 : 12}
      >
        <PriceInput
          priceLabel='Price'
          value={price}
          onChange={onChange}
          defaultValue={0}
          currency='$'
          endAdornment={!!plan}
        />
      </Grid>
      {plan && 
        <Grid
          spacing={0}
          xs={12}
          md={8}
          lg={8}
        >
          <PlanCard plan={plan} />
        </Grid>
      }
    </Grid>
  );
}

export default PricePlan