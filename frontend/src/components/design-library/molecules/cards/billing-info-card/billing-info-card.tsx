import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material'

export const BillingInfoCard = ({ name, address, city, state, zipCode, country, totalAmount }) => {
  const columns = 3
  const billingData = {
    name,
    address,
    city,
    state,
    zipCode,
    country,
    totalAmount,
  }

  return (
    <Card sx={{ width: '100%', margin: 'auto', padding: 2 }}>
      <CardContent style={{ padding: 0 }}>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage
            id="task.payment.invoice.billingInfo"
            defaultMessage="Billing Information"
          />
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Grid container spacing={2}>
          {Object.entries(billingData).map(([label, value]) => (
            <Grid size={{ xs: 12 / columns }} key={label}>
              <Typography variant="body2" color="textSecondary">
                {label}:
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
