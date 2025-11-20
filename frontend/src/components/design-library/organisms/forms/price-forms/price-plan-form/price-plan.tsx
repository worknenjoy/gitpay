import React from 'react'
import { Grid } from '@mui/material'
import PriceInput from '../../../../atoms/inputs/price-input/price-input'
import PlanCard from '../../../../molecules/cards/plan-card/plan-card'
import { PlanGrid } from './price-plan-form.styles'

type PricePlanProps = {
  price: number
  plan?: any | undefined | null
  onChange: any
}

const PricePlan = ({ price, plan, onChange }: PricePlanProps) => {
  return (
    <PlanGrid container spacing={0}>
      <Grid spacing={0} size={{ xs: 12, md: plan ? 4 : 12, lg: plan ? 4 : 12 }}>
        <PriceInput
          priceLabel="Price"
          value={price}
          onChange={onChange}
          defaultValue={0}
          currency="$"
          endAdornment={!!plan}
        />
      </Grid>
      {plan && (
        <Grid spacing={0} size={{ xs: 12, md: 8, lg: 8 }}>
          <PlanCard plan={plan} />
        </Grid>
      )}
    </PlanGrid>
  )
}

export default PricePlan
