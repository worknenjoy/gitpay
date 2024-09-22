import React from 'react';
import { Grid } from '@material-ui/core';
import PriceInput from '../../atoms/price-input/price-input';
import PlanCard from '../../molecules/plan-card/plan-card';

const PricePlan = ({ price, onChange }) => {
  return (
    <Grid
      container
      spacing={0}
    >
      <Grid
        spacing={0}
        xs={12}
        md={4}
        lg={4}
      >
        <PriceInput
          priceLabel='Price'
          value={price}
          onChange={onChange}
          defaultValue={0}
          currency='$'
        />
      </Grid>
      <Grid
        spacing={0}
        xs={12}
        md={8}
        lg={8}
      >
        <PlanCard />
      </Grid>
    </Grid>
  );
}

export default PricePlan