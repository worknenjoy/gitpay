import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import Notification from '../notification/notification'

import '../checkout/checkout-form'

import TopBar from '../topbar/topbar'
import Bottom from '../bottom/bottom'

// const paymentIcon = require('../../images/payment-icon-alt.png')

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'black',
    height: 180
  },
  formPayment: {
    marginTop: 10,
    marginBottom: 10
  },
  avatar: {
    margin: 10,
    width: 40,
    height: 40,
    border: `4px solid ${theme.palette.primary.main}`
  },
  bigAvatar: {
    width: 180,
    height: 180
  },
  smallAvatar: {
    width: 32,
    height: 32
  },
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  typo: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -30,
    paddingTop: 10,
    paddingBottom: 0,
    borderTop: '1px solid #999'
  },
  gridBlock: {
    paddingLeft: 20,
    paddingRight: 20
  },
  spaceRight: {
    marginRight: 10
  },
  altButton: {
    margin: 0,
    border: `1px dashed ${theme.palette.primary.main}`
  },
  btnPayment: {
    float: 'right',
    marginTop: 10
  },
  bigRow: {
    marginTop: 40
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10
  },
  rowList: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  rowContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  infoItem: {
    width: '100%',
    textAlign: 'center'
  },
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    maxWidth: 280,
    marginRight: 10,
    textAlign: 'center',
    display: 'flex'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  media: {
    width: 60,
    height: 60,
    marginLeft: 0,
    marginTop: 0
  },
  menuContainer: {
    marginBottom: 40,
    marginRight: 20,
    marginLeft: 20,
    width: '100%'
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {},
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 44,
    height: 44,
    margin: 20,
    padding: 20,
    textAlign: 'center',
    verticalAlign: 'center'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
})

class Order extends Component {
  componentWillMount () { }

  render () {
    const { classes } = this.props

    return (
      <div>
        <Grid container className={ classes.root } spacing={ 3 }>
          <TopBar />
          <Grid item xs={ 12 }>
            <Typography
              variant='display1'
              color='primary'
              align='left'
              className={ classes.typo }
              gutterBottom
            >
              page
            </Typography>
          </Grid>
          <Notification message='Pedido criado com sucesso' open />
        </Grid>
        <Bottom />
      </div>
    )
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Order)
