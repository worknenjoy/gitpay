import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ReactPlaceholder from 'react-placeholder'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import Moment from 'moment'

import Grid from 'material-ui/Grid'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Chip from 'material-ui/Chip'
import Typography from 'material-ui/Typography'
import Slide from 'material-ui/transitions/Slide'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import MenuItem from 'material-ui/Menu/MenuItem'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Stepper from 'material-ui/Stepper'
import Step from 'material-ui/Stepper/Step'
import StepButton from 'material-ui/Stepper/StepButton'
import Switch from 'material-ui/Switch'
import Select from 'material-ui/Select'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import { red, green } from 'material-ui/colors'

import UserIcon from 'material-ui-icons/AccountCircle'
import RedeemIcon from 'material-ui-icons/Redeem'
import AssignmentIcon from 'material-ui-icons/Assignment'
import NextIcon from 'material-ui-icons/NavigateNext'
import PreviousIcon from 'material-ui-icons/ArrowBack'
import ConcludeIcon from 'material-ui-icons/Done'

import PaymentTypeIcon from '../payment/payment-type-icon'

import Const from '../../consts'
import TabContainer from '../Tabs/TabContainer'

function Transition (props) {
  return <Slide direction='up' { ...props } />
}

const styles = theme => ({
  card: {
    minWidth: 275,
    marginBottom: 40,
    padding: 10
  },
  cardEmpty: {
    minWidth: 275,
    textAlign: 'center',
    marginBottom: 40
  },
  cardEmptyActions: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 40
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  label: {}
})

const messages = defineMessages({
  documentProvided: {
    id: 'account.document.cpf.provided',
    defaultMessage: 'CPF provided'
  },
  documentProvide: {
    id: 'account.document.cpf.provide',
    defaultMessage: 'Please provide your CPF'
  },
  addressLine1: {
    id: 'account.address.line1',
    defaultMessage: 'Adress line 1'
  },
  addressLine2: {
    id: 'account.address.line2',
    defaultMessage: 'Adress line 2'
  },
  cardTab: {
    id: 'account.type.card',
    defaultMessage: 'Credit Card'
  },
  paypalTab: {
    id: 'account.status.paypal',
    defaultMessage: 'PayPal'
  },
  state: {
    id: 'account.details.state',
    defaultMessage: 'State'
  },
  dob: {
    id: 'account.details.dob',
    defaultMessage: 'Date of birth'
  },
  zipcode: {
    id: 'account.details.zipcode',
    defaultMessage: 'Zipcode'
  },
  city: {
    id: 'account.details.city',
    defaultMessage: 'City'
  },
  birthYear: {
    id: 'account.details.birthYear',
    defaultMessage: 'Birth year'
  },
  activeStatus: {
    id: 'account.register.status',
    defaultMessage: 'Active'
  }
})

class Account extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accountUpdateModal: false,
      currentStep: 0,
      userId: null,
      selectedBank: '',
      bankNumberError: false,
      terms: false,
      monthOfBirth: 0,
      currentTab: 0
    }
    this.openUpdateModal = this.openUpdateModal.bind(this)
    this.closeUpdateModal = this.closeUpdateModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleBankAccount = this.handleBankAccount.bind(this)
    this.handleAcceptTerms = this.handleAcceptTerms.bind(this)
    this.handleTermsChange = this.handleTermsChange.bind(this)
    this.handleBankNumberSelect = this.handleBankNumberSelect.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handlePaypalAccount = this.handlePaypalAccount.bind(this)
  }

  componentDidMount () {
    if (this.props.user.logged) {
      const userId = this.props.user.user.id
      this.props.fetchAccount(userId)
      this.props.getBankAccount(userId)
      this.setState({ userId })
    }
  }

  openUpdateModal () {
    this.setState({ accountUpdateModal: true })
  }

  closeUpdateModal () {
    this.setState({ accountUpdateModal: false })
  }

  handleSubmit (e) {
    e.preventDefault()
    let formData = {
      'legal_entity[first_name]': e.target['legal_entity[first_name]'].value,
      'legal_entity[last_name]': e.target['legal_entity[last_name]'].value,
      'legal_entity[address][city]':
        e.target['legal_entity[address][city]'].value,
      'legal_entity[address][line1]':
        e.target['legal_entity[address][line1]'].value,
      'legal_entity[address][line2]':
        e.target['legal_entity[address][line2]'].value,
      'legal_entity[address][postal_code]':
        e.target['legal_entity[address][postal_code]'].value,
      'legal_entity[address][state]':
        e.target['legal_entity[address][state]'].value,
      'legal_entity[dob][day]': e.target['legal_entity[dob][day]'].value,
      'legal_entity[dob][month]': e.target['legal_entity[dob][month]'].value,
      'legal_entity[dob][year]': e.target['legal_entity[dob][year]'].value,
      'legal_entity[type]': 'individual'
    }

    if (e.target['legal_entity[personal_id_number]'].value) {
      formData['legal_entity[personal_id_number]'] =
        e.target['legal_entity[personal_id_number]'].value
    }

    this.props.updateAccount(this.state.userId, formData)
    this.setState({ accountUpdateModal: false })
  }

  handleBankAccount (e) {
    e.preventDefault()
    const bankNumber = e.target['bank_number'].value
    if (bankNumber) {
      const routingNumber = `${bankNumber}-${e.target.routing_number.value}`
      if (e.target.account_number.value.indexOf('-') > -1) {
        this.setState({ AccountNumberError: true })
      }
      else {
        this.setState({ AccountNumberError: false })
        const accountNumber = e.target.account_number.value.replace('-', '')
        this.props.createBankAccount(this.state.userId, {
          routing_number: routingNumber,
          account_number: accountNumber
        })
      }
    }
    else {
      this.setState({ bankNumberError: true })
    }
  }

  handlePaypalAccount (e) {
    e.preventDefault()
    this.props.updateUser(this.state.userId, {
      paypal_id: e.target.paypal_email.value
    })
  }

  handleTabChange (e, value) {
    this.setState({ currentTab: value })
  }

  handleBankNumberSelect (e) {
    this.setState({ selectedBank: e.target.value, bankNumberError: false })
  }

  handleStepTab (index) {
    this.setState({ currentStep: index })
  }

  handleTermsChange (e) {
    e.preventDefault()
    const terms = e.target.value === 'terms'
    this.setState({ terms })
  }

  handleAcceptTerms (e) {
    e.preventDefault()
    if (this.state.terms) {
      this.props.updateAccount(this.state.userId, {
        tos_acceptance: {
          date: Math.round(+new Date() / 1000)
        }
      })
    }
  }

  onChange (e) {
    e.preventDefault()
    let formData = {}
    formData[e.target.name] = e.target.value
    this.setState(formData)
  }

  render () {
    const { classes, account, bankAccount, user } = this.props

    const getSteps = () => {
      return [
        <FormattedMessage id='account.id.verification' defaultMessage='Verify identity' />,
        <FormattedMessage id='account.id.register.bank' defaultMessage='Register bank account' />,
        <FormattedMessage id='account.terms.accept.step' defaultMessage='Accept terms' />
      ]
    }

    const getStepsIcon = index => {
      return [<UserIcon />, <RedeemIcon />, <AssignmentIcon />][index]
    }

    const getStepContent = step => {
      return getSteps()[step]
    }

    const steps = getSteps()

    return (
      <div>

        <ReactPlaceholder
          showLoadingAnimation
          type='media'
          rows={ 5 }
          ready={ account.completed && !account.error.error }
        >
          <div>
            <AppBar position='static' color='default' style={ { marginTop: 20, boxShadow: 'none', background: 'transparent' } }>
              <Tabs
                value={ this.state.currentTab }
                onChange={ this.handleTabChange }
                scrollable
                scrollButtons='on'
                indicatorColor='primary'
                textColor='primary'
              >
                <Tab style={ { margin: 10 } } value={ 0 } label={this.props.intl.formatMessage(messages.cardTab)} icon={ <PaymentTypeIcon type='stripe' notext /> } />
                <Tab style={ { margin: 10 } } value={ 1 } label={this.props.intl.formatMessage(messages.paypalTab)} icon={ <PaymentTypeIcon type='paypal' notext /> } />
              </Tabs>
            </AppBar>
            { this.state.currentTab === 0 &&
            <TabContainer>
              { account.data.id ? (
                <div>
                  <Stepper nonLinear activeStep={ this.state.currentStep }>
                    { steps.map((label, index) => {
                      return (
                        <Step key={ index }>
                          <StepButton
                            onClick={ () => this.handleStepTab(index) }
                            icon={ getStepsIcon(index) }
                          >
                            { label }
                          </StepButton>
                        </Step>
                      )
                    }) }
                  </Stepper>
                  { this.state.currentStep === 0 && (
                    <Card className={ classes.card }>
                      <CardContent>
                        <div className={ classes.title }>
                          <Typography className={ classes.pos } color='textSecondary'>
                            <FormattedMessage id='account.status' defaultMessage='Your account status:' />,
                          </Typography>
                          { account.data.verification.disabled_reason ? (
                            <FormattedMessage id='account.status.pending' defaultMessage='Pending'>
                              {(msg) => (
                                <Chip
                                  label={
                                    Const.ACCOUNT_REASONS[account.data.verification.disabled_reason] || msg
                                  }
                                  style={ { marginRight: 20, backgroundColor: cyan['500'] } }
                                />
                              )}
                            </FormattedMessage>
                          ) : (
                            <div>
                              { account.data.external_accounts.total_count ? (
                                <FormattedMessage id='account.bank.activated' defaultMessage='Activated'>  
                                  {(msg) => (
                                    <Chip
                                      label={ msg }
                                      style={ {
                                        color: 'white',
                                        marginRight: 20,
                                        backgroundColor: 'green'
                                      } }
                                    />
                                  )}
                                </FormattedMessage>
                              ) : (
                                <FormattedMessage id='account.bank.missing' defaultMessage='Missing bank data (go to next step)'>  
                                  {(msg) => (
                                    <Chip
                                      label={ msg }
                                      style={ {
                                        color: 'white',
                                        marginRight: 20,
                                        backgroundColor: green['500']
                                      } }
                                    />  
                                  )}
                                </FormattedMessage>
                              ) }
                            </div>
                          ) }
                        </div>
                        { account.data.verification.fields_needed.length && account.data.verification.fields_needed[0] !== 'legal_entity.verification.document' ? (
                          <div>
                            <Typography component='p'>
                              <FormattedMessage id='account.pending.title' defaultMessage='We have the following items that needs to be verified:' />
                            </Typography>
                            <div>
                              { account.data.verification.fields_needed.map(
                                (item, i) => (
                                  <Chip
                                    style={ { margin: 3 } }
                                    key={ i }
                                    label={ `${Const.ACCOUNT_FIELDS[item]}` }
                                  />
                                )
                              ) }
                            </div>
                          </div>
                        ) : (
                          <FormattedMessage id='account.details.complete' defaultMessage='Your account is now verified and you are able to receive all payments from tasks'>  
                            {(msg) => (
                              <Chip
                                style={ { margin: 3 } }
                                label={ msg }
                              />
                            )}
                          </FormattedMessage>
                        ) }
                      </CardContent>
                      <CardActions>
                        <Button
                          style={ { color: 'white' } }
                          size='large'
                          variant='raised'
                          color='primary'
                          onClick={ this.openUpdateModal }
                        >
                          { account.data.verification.disabled_reason
                            ? <FormattedMessage id='account.activate' defaultMessage='Activate account' />
                            : <FormattedMessage id='account.update' defaultMessage='Update account' /> }
                        </Button>
                        <Button
                          style={ { color: 'white' } }
                          size='large'
                          variant='raised'
                          color='primary'
                          onClick={ () => this.handleStepTab(1) }
                        >
                          <FormattedMessage id='account.steps.next' defaultMessage='Next step' />
                          <NextIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  ) }
                  { this.state.currentStep === 1 && (
                    <form
                      onSubmit={ this.handleBankAccount }
                      style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
                    >
                      <Card className={ classes.card }>
                        <CardContent>
                          <div style={ { marginBottom: 10 } }>
                            <Typography>{ getStepContent(1) }</Typography>
                          </div>
                          <Grid container spacing={ 24 }>
                            <Grid item xs={ 12 }>
                              { bankAccount.data.routing_number ? (
                                <Typography color='primary'>
                                  <FormattedMessage id='account.active.statement' defaultMessage='Your bank account is active' />
                                </Typography>
                              ) : (
                                <FormControl
                                  className={ classes.formControl }
                                  error={ this.state.bankNumberError }
                                >
                                  <Select
                                    value={ this.state.selectedBank }
                                    displayEmpty
                                    name='bank_number'
                                    onChange={ this.handleBankNumberSelect }
                                  >
                                    <MenuItem value='' disabled>
                                      <em>
                                        <FormattedMessage id='account.banks.list.title' defaultMessage='Select your bank' />
                                      </em>
                                    </MenuItem>
                                    { Object.keys(Const.BANK_NUMBERS).map(
                                      (item, i) => {
                                        return (
                                          <MenuItem key={ i } value={ item }>{ `${
                                            Const.BANK_NUMBERS[item]
                                          }` }</MenuItem>
                                        )
                                      }
                                    ) }
                                  </Select>
                                  { this.state.bankNumberError && (
                                    <FormHelperText>
                                      { ' ' }
                                      <FormattedMessage id='account.bank.select' defaultMessage='Please select your bank' />
                                    </FormHelperText>
                                  ) }
                                </FormControl>
                              ) }
                            </Grid>
                          </Grid>
                          <Grid container spacing={ 24 }>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <FormattedMessage id='account.details.rountingNumber' defaultMessage='Rounting number'>
                                    {(msg) => (
                                      <Input
                                        id='bank-routing-number'
                                        name='routing_number'
                                        placeholder={msg}
                                        style={ { marginRight: 20 } }
                                        disabled={ !!bankAccount.data.routing_number }
                                        defaultValue={ bankAccount.data.routing_number }
                                      />
                                    )}
                                </FormattedMessage>
                              </FormControl>
                              <FormControl
                                error={ this.state.AccountNumberError }
                              >
                                <FormattedMessage id='account.details.accountNumber' defaultMessage='Account number'>
                                    {(msg) => (
                                      <Input
                                        id='bank-account-number'
                                        name='account_number'
                                        placeholder={msg}
                                        disabled={ !!bankAccount.data.routing_number }
                                        defaultValue={
                                          bankAccount.data.last4
                                            ? `*****${bankAccount.data.last4}`
                                            : ''
                                        }
                                      />
                                    )}
                                </FormattedMessage>
                                { this.state.AccountNumberError && (
                                  <FormHelperText>
                                    { ' ' }
                                    <FormattedMessage id='account.details.numbersOnly' defaultMessage='Just numbers only' />
                                  </FormHelperText>
                                ) }
                              </FormControl>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='raised'
                            color='primary'
                            type='submit'
                            disabled={ !!bankAccount.data.routing_number }
                          >
                            <FormattedMessage id='account.details.activate.action' defaultMessage='Activate bank account' />
                          </Button>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='raised'
                            color='primary'
                            onClick={ () => this.handleStepTab(0) }
                          >
                            <PreviousIcon />
                            Passo anterior
                          </Button>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='raised'
                            color='primary'
                            onClick={ () => this.handleStepTab(2) }
                          >
                            <FormattedMessage id='account.steps.next' defaultMessage='Next step' />
                            <NextIcon />
                          </Button>
                        </CardActions>
                      </Card>
                    </form>
                  ) }
                  { this.state.currentStep === 2 && (
                    <div>
                      { !account.data.tos_acceptance.date ? (
                        <form
                          onSubmit={ this.handleAcceptTerms }
                          style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
                        >
                          <Card className={ classes.card }>
                            <CardContent>
                              <div style={ { marginBottom: 20 } }>
                                <Typography component='title'>
                                  { getStepContent(2) }
                                </Typography>
                              </div>
                              <Grid container spacing={ 24 }>
                                <Grid item xs={ 12 }>
                                  <Typography color='primary'>
                                    <a
                                      target='_blank'
                                      href='https://stripe.com/br/connect-account/legal'
                                    >
                                      { ' ' }
                                      <FormattedMessage id='account.details.terms.access' defaultMessage='Access Stripe terms' />{ ' ' }
                                    </a>
                                  </Typography>
                                  <FormControl>
                                    <FormattedMessage id='account.details.terms.read' defaultMessage='I read and I accept the Stripe terms to receive transfers about payments directly on my account'>
                                      {(msg) => (
                                        <FormControlLabel
                                          control={
                                            <Switch
                                              checked={ this.state.terms }
                                              onChange={ this.handleTermsChange }
                                              value='terms'
                                              color='primary'
                                            />
                                          }
                                          label={msg}
                                        />
                                      )}
                                    </FormattedMessage>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </CardContent>
                            <CardActions>
                              <Button
                                style={ { color: 'white' } }
                                size='large'
                                variant='raised'
                                color='primary'
                                type='submit'
                                disabled={ !this.state.terms }
                                onClick={ this.handleAcceptTerms }
                              >
                                <FormattedMessage id='account.terms.accept' defaultMessage='Accept Terms' />
                              </Button>
                              <Button
                                style={ { color: 'white' } }
                                size='large'
                                variant='raised'
                                color='primary'
                                onClick={ () => this.handleStepTab(1) }
                              >
                                <PreviousIcon />
                                <FormattedMessage id='account.steps.previous' defaultMessage='Previous step' />
                              </Button>
                            </CardActions>
                          </Card>
                        </form>
                      ) : (
                        <Card className={ classes.card }>
                          <CardContent>
                            <div style={ { marginBottom: 10 } }>
                              <Typography>{ getStepContent(2) }</Typography>
                            </div>
                            <Grid container spacing={ 24 }>
                              <Grid item xs={ 12 }>
                                <Typography color='primary'>
                                  <FormattedMessage id='account.terms.accepted' defaultMessage='You agreed with the terms in' />
                                  { `${Moment.unix(
                                    account.data.tos_acceptance.date
                                  ).format('DD/MM/YYYY [às] HH:mm:ss')}` }
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                          <CardActions>
                            <Button
                              style={ { color: 'white' } }
                              size='large'
                              variant='raised'
                              color='primary'
                              onClick={ () => this.handleStepTab(1) }
                            >
                              <PreviousIcon />
                              <FormattedMessage id='account.steps.previous' defaultMessage='Previous step' />
                            </Button>
                            <Button
                              style={ { color: 'white' } }
                              size='large'
                              variant='raised'
                              color='primary'
                              onClick={ () => this.handleStepTab(0) }
                            >
                              <FormattedMessage id='account.steps.finish' defaultMessage='Finish' />
                              <ConcludeIcon />
                            </Button>
                          </CardActions>
                        </Card>
                      ) }
                    </div>
                  ) }
                  <Dialog
                    open={ this.state.accountUpdateModal }
                    transition={ Transition }
                    onClose={ this.closeUpdateModal }
                    aria-labelledby='alert-dialog-slide-title'
                    aria-describedby='alert-dialog-slide-description'
                    fullWidth
                    maxWidth='sm'
                  >
                    <DialogTitle id='alert-dialog-slide-title'>
                      <FormattedMessage id='account.verify.title' defaultMessage='Verify account' />
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id='alert-dialog-slide-description'>
                        <FormattedMessage id='account.verify.desc' defaultMessage='Please fill the data to verify your account' />
                      </DialogContentText>
                      <form
                        onSubmit={ this.handleSubmit }
                        onChange={ this.onChange }
                        style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
                      >
                        <Grid container spacing={ 24 }>
                          <Grid item xs={ 12 }>
                            <FormControl>
                              <FormattedMessage id='account.verify.firstName' defaultMessage='First name'>
                                {(msg) => (
                                  <Input
                                    id='payment-form-user'
                                    name='legal_entity[first_name]'
                                    placeholder={msg}
                                    style={ { marginRight: 20 } }
                                    defaultValue={ account.data.legal_entity.first_name }
                                  />
                                )}
                              </FormattedMessage>
                            </FormControl>
                            <FormControl>
                            <FormattedMessage id='account.verify.lastName' defaultMessage='Last name'>
                              {(msg) => (
                                <Input
                                  name='legal_entity[last_name]'
                                  id='adornment-email'
                                  placeholder={msg}
                                  style={ { marginRight: 20 } }
                                  defaultValue={ account.data.legal_entity.last_name }
                                />
                              )}
                            </FormattedMessage>
                            </FormControl>
                            <FormControl>
                              <Input
                                id='payment-form-user'
                                name='legal_entity[personal_id_number]'
                                placeholder={
                                  account.data.legal_entity
                                    .personal_id_number_provided
                                    ? this.props.intl.formatMessage(messages.documentProvided)
                                    : this.props.intl.formatMessage(messages.documentProvide)
                                }
                                disabled={
                                  account.data.legal_entity
                                    .personal_id_number_provided
                                }
                                defaultValue={
                                  account.data.legal_entity.personal_id_number
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={ 12 }>
                            <FormControl>
                              <Input
                                id='payment-form-user'
                                name='legal_entity[address][line1]'
                                placeholder={this.props.intl.formatMessage(messages.addressLine1)}
                                style={ { marginRight: 20 } }
                                defaultValue={
                                  account.data.legal_entity.address.line1
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                id='payment-form-user'
                                name='legal_entity[address][line2]'
                                placeholder={this.props.intl.formatMessage(messages.addressLine2)}
                                style={ { marginRight: 20 } }
                                defaultValue={
                                  account.data.legal_entity.address.line2
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                name='legal_entity[address][postal_code]'
                                id='adornment-email'
                                placeholder={this.props.intl.formatMessage(messages.zipCode)}
                                defaultValue={
                                  account.data.legal_entity.address.postal_code
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={ 12 }>
                            <FormControl>
                              <Input
                                name='legal_entity[address][city]'
                                id='adornment-city'
                                placeholder={this.props.intl.formatMessage(messages.city)}
                                style={ { marginRight: 20 } }
                                defaultValue={
                                  account.data.legal_entity.address.city
                                }
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                id='payment-form-user'
                                name='legal_entity[address][state]'
                                placeholder={this.props.intl.formatMessage(messages.state)}
                                defaultValue={
                                  account.data.legal_entity.address.state
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={ 12 }>
                            <FormControl>
                              <Input
                                id='payment-form-user'
                                name='legal_entity[dob][day]'
                                placeholder={this.props.intl.formatMessage(messages.dob)}
                                style={ { marginRight: 20 } }
                                defaultValue={ account.data.legal_entity.dob.day }
                              />
                            </FormControl>
                            <FormControl>
                              <Select
                                autoWidth
                                native
                                name='legal_entity[dob][month]'
                                style={ { marginRight: 10 } }
                                onChange={ (event) => {
                                  this.setState({ monthOfBirth: event.target.value })
                                } }
                              >
                                <option value=''>
                                  <em>
                                    <FormattedMessage id='account.details' defaultMessage='Month of birth' />
                                  </em>
                                </option>
                                { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                  (item, i) => {
                                    return (
                                      <option selected={ !!(item === account.data.legal_entity.dob.month) } key={ i } value={ item }>{ `${
                                        item
                                      }` }</option>
                                    )
                                  }
                                ) }
                              </Select>
                            </FormControl>
                            <FormControl>
                              <Input
                                name='legal_entity[dob][year]'
                                id='adornment-email'
                                placeholder={this.props.intl.formatMessage(messages.birthYear)}
                                defaultValue={ account.data.legal_entity.dob.year }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={ 12 }>
                            <div style={ { float: 'right' } }>
                              <Button
                                color='primary'
                                onClick={ this.closeUpdateModal }
                              >
                                <FormattedMessage id='account.actions.cancel' defaultMessage='Cancel' />
                              </Button>
                              <Button
                                type='submit'
                                variant='raised'
                                color='secondary'
                              >
                                <FormattedMessage id='account.actions.update' defaultMessage='Update Account' />
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div>
                  { !account.data.id &&
                  <Card className={ classes.cardEmpty }>
                    <CardContent>
                      <Typography className={ classes.title } color='textSecondary'>
                        <FormattedMessage id='account.register.headline' defaultMessage='There is no account registered to receive the payments' />
                      </Typography>
                    </CardContent>
                    <CardActions className={ classes.cardEmptyActions }>
                      <Button
                        style={ { color: 'white' } }
                        size='large'
                        variant='raised'
                        color='primary'
                        onClick={ () => this.props.createAccount(user.user.id) }
                      >
                        <FormattedMessage id='account.register.create.action' defaultMessage='Create account' />
                      </Button>
                    </CardActions>
                  </Card> }
                </div>)
              }
            </TabContainer> }
            { this.state.currentTab === 1 &&
            <TabContainer>
              <form
                onSubmit={ this.handlePaypalAccount }
                style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
              >
                <Card className={ classes.card }>
                  <CardContent>
                    <div className={ classes.title }>
                      <Typography className={ classes.pos } color='textSecondary'>
                        <FormattedMessage id='account.register.paypal.title' defaultMessage='Activate PayPal account:' />
                      </Typography>
                      <Typography component='p' color='textSecondary' style={ { marginBottom: 20, marginTop: 20 } }>
                        <FormattedMessage id='account.register.paypal.description' defaultMessage='When you activate your account with PayPal, you will receive the bounties in the account that you will provide here. The Paypal taxes will be applied' />
                      </Typography>
                      { !user.user.paypal_id ? (
                        <FormattedMessage id='account.register.paypal.status' defaultMessage='This account is not associated with PayPal'>
                          {(msg) => (
                            <Chip
                              label={msg}
                              style={ { marginRight: 20, backgroundColor: 'orange' } }
                            />
                          )}
                        </FormattedMessage>
                      ) : (
                        <div>
                          <Typography className={ classes.pos } color='textSecondary'>
                          <FormattedMessage id='account.register.account.status' defaultMessage='Account status' />
                          </Typography>
                          <Chip
                            label={this.props.intl.formatMessage(messages.activeStatus)}
                            style={ {
                              color: 'white',
                              marginRight: 20,
                              backgroundColor: 'green'
                            } }
                          />
                        </div>
                      ) }
                    </div>
                    <Grid item xs={ 12 }>
                      <FormControl>
                        <InputLabel htmlFor='adornment-password'>
                          <FormattedMessage id='account.register.paypay.email' defaultMessage='PayPal registered email' />
                        </InputLabel>
                        <Input
                          name='paypal_email'
                          type='email'
                          id='adornment-email'
                          style={ { marginRight: 20 } }
                          defaultValue={
                            user.user.paypal_id ? `${user.user.paypal_id}` : `${user.user.email}`
                          }
                        />
                      </FormControl>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      style={ { color: 'white' } }
                      size='large'
                      variant='raised'
                      color='primary'
                      type='submit'
                    >
                      { !user.paypal_id
                        ? 'Ativar conta'
                        : 'Atualizar conta' }
                    </Button>
                  </CardActions>
                </Card>
              </form>
            </TabContainer> }
          </div>
        </ReactPlaceholder>
      </div>
    )
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  createAccount: PropTypes.func,
  bankAccount: PropTypes.object,
  account: PropTypes.object,
  createBankAccount: PropTypes.func,
  updateAccount: PropTypes.func,
  fetchAccount: PropTypes.func,
  getBankAccount: PropTypes.func,
  updateUser: PropTypes.func
}

export default injectIntl(withStyles(styles)(Account))
