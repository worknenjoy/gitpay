import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  Collapse
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faRocket, faCheck } from '@fortawesome/free-solid-svg-icons'

import {
  AirplanemodeActive
} from '@material-ui/icons'

const paymentIcon = require('../../images/payment-icon-alt.png')
const styleCardPlanCorners = {
  float: 'left',
  height: 350,
  marginTop: 20,
  width: 270
}
const styleCardPlanMiddel = {
  float: 'left',
  backgroundColor: '#009688',
  height: 390,
  width: 270
}
const styleIconMiddlePlan = {
  color: '#fff',
  fontSize: 69,
  display: 'inline-block'
}
const styleIconFirstPlan = {
  color: '#9F9F9F',
  fontSize: 50,
  display: 'inline-block',
  transform: 'rotate(369deg)',
  marginTop: 12,
}
const styleIconThirdPlan = {
  color: '#9F9F9F',
  fontSize: 50,
  display: 'inline-block',
  transform: 'rotate(315deg)',
  marginTop: 17
}
const styleCardContent = {
  width: '100%',
  textAlign: 'center'
}
const styleContainerplans = {
  margin: '47px auto',
  position: 'relative',
  right: 62
}
const styleContainerButtomsActions = {
  marginTop: 470
}
const stylePPercent = {
  fontSize: 17,
  fontWeight: 'bold',
  opacity: '0.7',
  marginTop: 17,
}
const stylePPercentMiddle = {
  fontSize: 17,
  fontWeight: 'bold',
  opacity: '0.7',
  marginTop: 17,
  color: '#fff'
}
const stypePPlan = {
  color: '#fff',
  fontWeight: 600,
  letterSpacing: 1,
  marginTop: 10
}
const stypePPlanDescription = {
  color: '#c1c1c1',
  fontWeight: 600,
  letterSpacing: 1,
  marginTop: 5,
  fontSize: 10
}
const stypePPlanDescriptionMiddle = {
  color: '#fff',
  fontWeight: 600,
  letterSpacing: 1,
  marginTop: 5,
  fontSize: 10
}
const stypePPlanListElement = {
  color: '#a8a8a8',
  fontWeight: 'bold',
  letterSpacing: 1,
  marginTop: 18,
  fontSize: 10,
  float: 'left'
}
const stypeContainerPlanListElement = {
  padding: '0px 45px 0px 29px',
  marginTop: 5
}
const stypePlanListIcon = {
  color: '#009688',
  fontSize: 10,
  padding: '0 15px 0 0',
}
const stylePPricePlan = {
  color: 'rgb(0, 150, 136)',
  fontSize: 23,
  marginTop: 88,
  fontWeight: 600,
  letterSpacing: 3,
  opacity: '0.8'
}
const stylePPricePlanMiddle = {
  color: '#fff',
  fontSize: 23,
  marginTop: 88,
  fontWeight: 600,
  letterSpacing: 3,
  opacity: '0.8'
}
const styleInputPrice = {
  width: '90%'
}
const stylePayCreditCardButtom = {
  marginLeft: 20,
  marginRight: 62
}
const styleButtomChoosePlan = {
  margin: '11px 40px 0 0'
}

import PaymentDialog from '../payment/payment-dialog'
import PaypalPaymentDialog from '../payment/paypal-payment-dialog'

class TaskPaymentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPrice: 0,
      finalPrice: 0,
      orderPrice: 0,
      samplePrice: 0
    }
  }

  pickTaskPrice = (price) => {
    this.setState({
      currentPrice: price,
      finalPrice: parseInt(price) + parseInt(this.state.orderPrice)
    })
  }

  handleInputChange = (e) => {
    this.setState({ currentPrice: e.target.value })
  }

  handlePayment = (value) => {
    this.props.openDialog(value)
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        <Collapse in={ !!this.props.open }>
          <Card className={ classes.card }>
            <FormattedMessage id='task.payment.headline.bounty.create' defaultMessage='Create a bounty for this task'>
              { (msg) => (
                <CardMedia
                  className={ classes.cover }
                  image={ paymentIcon }
                  title={ msg }
                />
              ) }
            </FormattedMessage>
            <div className={ classes.details }>
              <CardContent className={ classes.content }>
                <Typography variant='h5'>
                  <FormattedMessage id='task.payment.headline.bounty.add' defaultMessage='Add a bounty for this task' />
                </Typography>
                <Typography variant='subheading' color='textSecondary'>
                  <FormattedMessage id='task.payment.form.message.subheading' defaultMessage='Create a bounty for this task and who you assign will receive the payment for this bounty' />
                </Typography>
                <div className={ classes.chipContainer }>
                  <Chip
                    label=' $ 20'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(20) }
                  />
                  <Chip
                    label=' $ 50'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(50) }
                  />
                  <Chip
                    label=' $ 100'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(100) }
                  />
                  <Chip
                    label=' $ 150'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(150) }
                  />
                  <Chip
                    label=' $ 300'
                    className={ classes.chip }
                    onClick={ () => this.pickTaskPrice(300) }
                  />
                </div>
                <form className={ classes.formPayment } action='POST'>
                  <FormControl style={ styleInputPrice }>
                    <InputLabel htmlFor='adornment-amount' >
                      <FormattedMessage id='task.payment.input.amount.value' defaultMessage='Price' />
                    </InputLabel>
                    <FormattedMessage id='task.payment.input.amount' defaultMessage='Price insert a value for this task' >
                      { (msg) => (
                        <Input
                          id='adornment-amount'
                          startAdornment={ <InputAdornment position='start'>$</InputAdornment> }
                          placeholder={ msg }
                          type='number'
                          inputProps={ { 'min': 0 } }
                          defaultValue={ this.state.currentPrice }
                          value={ this.state.currentPrice }
                          onChange={ this.handleInputChange }

                        />
                      ) }
                    </FormattedMessage>
                  </FormControl>
                  <div className={ classes.chipContainer } style={ styleContainerplans }>
                    <Card className={ classes.card } style={ styleCardPlanCorners }>
                      <CardContent style={ styleCardContent }>
                        <FontAwesomeIcon icon={ faPaperPlane } style={ styleIconFirstPlan } />
                        <Typography component='h4' style={ stylePPercent }>
                          30% fee
                        </Typography>
                        <Typography component='p' style={ stypePPlan }>
                          FULL SUPPORT
                        </Typography>
                        <Typography className={ classes.pos } color='textSecondary' style={ stypePPlanDescription }>
                          PRIVATE PLAN WITH SUPPORT
                        </Typography>
                        <div style={ stypeContainerPlanListElement }>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> For public projects
                          </div>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> We manage the whole workflow
                          </div>
                        </div>
                        <div style={ stylePPricePlan }>
                          $ 26
                        </div>
                        <Button
                          onClick={ () => this.handlePayment('PaymentDialog') }
                          variant='contained'
                          color='primary'
                          className={ classes.btnPayment }
                          style={ styleButtomChoosePlan }
                        >
                          <FormattedMessage id='task.payment.creditcard.action2' defaultMessage='CHOOSE THIS PLAN' values={ {
                            amount: this.state.currentPrice
                          } } />
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className={ classes.card } style={ styleCardPlanMiddel }>
                      <CardContent style={ styleCardContent }>
                        <AirplanemodeActive style={ styleIconMiddlePlan } />
                        <Typography component='h4' style={ stylePPercent }>
                          18% fee
                        </Typography>
                        <Typography component='p' style={ stylePPercentMiddle }>
                          PRIVATE PROJECTS
                        </Typography>
                        <Typography className={ classes.pos } color='textSecondary' style={ stypePPlanDescriptionMiddle }>
                          for private projects
                        </Typography>
                        <div style={ stypeContainerPlanListElement }>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> Private projects
                          </div>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> Basic campaign
                          </div>
                        </div>
                        <div style={ stylePPricePlanMiddle }>
                          $ 23,60
                        </div>
                        <Button
                          onClick={ () => this.handlePayment('PaymentDialog') }
                          variant='contained'
                          color='primary'
                          className={ classes.btnPayment }
                          style={ styleButtomChoosePlan }
                        >
                          <FormattedMessage id='task.payment.creditcard.action2' defaultMessage='CHOOSE THIS PLAN' values={ {
                            amount: this.state.currentPrice
                          } } />
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className={ classes.card } style={ styleCardPlanCorners }>
                      <CardContent style={ styleCardContent }>
                        <FontAwesomeIcon icon={ faRocket } style={ styleIconThirdPlan } />
                        <Typography component='h4' style={ stylePPercent }>
                          8% fee
                        </Typography>
                        <Typography component='p' style={ stypePPlan }>
                          OPEN SOURCE
                        </Typography>
                        <Typography className={ classes.pos } color='textSecondary' style={ stypePPlanDescription }>
                          for Open Souce projects
                        </Typography>
                        <div style={ stypeContainerPlanListElement }>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> For public projects
                          </div>
                          <div style={ stypePPlanListElement }>
                            <FontAwesomeIcon icon={ faCheck } style={ stypePlanListIcon } /> Basic campaign
                          </div>
                        </div>
                        <div style={ stylePPricePlan }>
                          $ 21,60
                        </div>
                        <Button
                          onClick={ () => this.handlePayment('PaymentDialog') }
                          variant='contained'
                          color='primary'
                          className={ classes.btnPayment }
                          style={ styleButtomChoosePlan }
                        >
                          <FormattedMessage id='task.payment.creditcard.action2' defaultMessage='CHOOSE THIS PLAN' values={ {
                            amount: this.state.currentPrice
                          } } />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <div style={ styleContainerButtomsActions }>
                    <Button
                      style={ stylePayCreditCardButtom }
                      disabled={ !this.state.currentPrice }
                      onClick={ () => this.handlePayment('PaymentDialog') }
                      variant='contained'
                      color='primary'
                      className={ classes.btnPayment }>
                      <FormattedMessage id='task.payment.creditcard.action' defaultMessage='Pay $ {amount} with Credit Card' values={ {
                        amount: this.state.currentPrice
                      } } />
                    </Button>
                    <Button
                      disabled={ !this.state.currentPrice }
                      onClick={ () => this.handlePayment('PaypalPaymentDialog') }
                      variant='contained'
                      color='primary'
                      className={ classes.btnPayment }
                    >
                      <FormattedMessage id='task.payment.paypal.action' defaultMessage='Pay $ {amount} with PayPal' values={ {
                        amount: this.state.currentPrice
                      } } />
                    </Button>
                  </div>
                </form>

              </CardContent>
            </div>
          </Card>
        </Collapse>
        <PaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          itemPrice={ this.state.currentPrice }
          price={ this.state.finalPrice }
          user={ this.props.user }
          task={ this.props.match.params.id }
        />

        <PaypalPaymentDialog
          open={ this.props.dialog.open && this.props.dialog.target === 'PaypalPaymentDialog' }
          onClose={ this.props.closeDialog }
          addNotification={ this.props.addNotification }
          onPayment={ this.props.updateTask }
          itemPrice={ this.state.currentPrice }
          price={ this.state.finalPrice }
          task={ this.props.match.params.id }
          createOrder={ this.props.createOrder }
          user={ this.props.user }
          order={ this.props.order }
        />
      </div>
    )
  }
}

TaskPaymentForm.propTypes = {
  open: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  dialog: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object,
  order: PropTypes.object,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  updateTask: PropTypes.func,
  createOrder: PropTypes.func.isRequired
}

export default TaskPaymentForm
