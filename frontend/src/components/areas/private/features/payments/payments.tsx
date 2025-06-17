import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Container,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  }
}))

const Payments = ({ orders, getOrders, user }) => {
  const classes = useStyles()

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <Paper elevation={0} style={{ backgroundColor: 'transparent' }}>
      <Container>
        <Typography variant='h5' gutterBottom style={{ marginTop: 40 }}>
          <FormattedMessage id='issues.explore.title' defaultMessage='Explore issues' />
        </Typography>
        <Typography variant='caption' gutterBottom>
          <FormattedMessage
            id='issues.explore.description'
            defaultMessage="Here you can see all the issues on our network"
          />
        </Typography>
        <div style={{ marginBottom: 20 }}>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <></>
          </div>

        </div>
      </Container>
    </Paper>
  )
}

export default Payments
