import React, { Component } from 'react'

import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Notification from 'design-library/atoms/notifications/notification/notification'

import '../../../../../checkout/checkout-form'

import TopBar from 'design-library/organisms/topbar/topbar'
import Bottom from 'design-library/organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'

// import paymentIcon from 'images/payment-icon-alt.png'

const Root = styled(Grid)(() => ({
  flexGrow: 1,
  backgroundColor: 'black',
  height: 180,
}))

class Order extends Component {
  componentWillMount() {}

  render() {
    const {} = this.props

    return (
      <div>
        <Root container spacing={3}>
          <TopBar />
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="display1"
              color="primary"
              align="left"
              sx={{ ml: 2.5, mr: 2.5, mt: -3.75, pt: 1.25, pb: 0, borderTop: '1px solid #999' }}
              gutterBottom
            >
              page
            </Typography>
          </Grid>
          <Notification message="Pedido criado com sucesso" open />
        </Root>
        <Bottom />
      </div>
    )
  }
}

Order.propTypes = {}

export default Order
