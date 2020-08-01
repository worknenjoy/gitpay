import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  withStyles,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
  Typography,
  Slide,
  Input,
  InputLabel,
  FormControl,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Stepper,
  Step,
  StepButton,
  Switch,
  Select,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core'

import {
  green,
  cyan
} from '@material-ui/core/colors'

import {
  People,
  Redeem,
  Assignment,
  NavigateNext,
  NavigateBefore,
  Done,
  Payment,
  ArrowBack as PreviousIcon,
  Public as PublicIcon,
  Person as PersonIcon
} from '@material-ui/icons'

import ReactPlaceholder from 'react-placeholder'
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl'
import Moment from 'moment'

import Const from '../../consts'
import TabContainer from '../Tabs/TabContainer'
import messages from './messages'

import CountryPicker from './country-picker'

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
  cardEmptyActionsAlt: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 20
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12
  },
  chip: {
    margin: theme.spacing(1),
  },
  label: {}
})

class Account extends Component {
  static propTypes = {
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

  constructor (props) {
    super(props)
    this.state = {
      accountUpdateModal: false,
      countryPickerModal: false,
      currentStep: 0,
      userId: null,
      countryCode: null,
      countryLabel: null,
      countryImage: null,
      canCreateAccount: false,
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
      'business_profile[url]': e.target['business_profile[url]'].value,
      'individual[first_name]': e.target['individual[first_name]'].value,
      'individual[last_name]': e.target['individual[last_name]'].value,
      'individual[address][city]':
        e.target['individual[address][city]'].value,
      'individual[address][line1]':
        e.target['individual[address][line1]'].value,
      'individual[address][line2]':
        e.target['individual[address][line2]'].value,
      'individual[address][postal_code]':
        e.target['individual[address][postal_code]'].value,
      'individual[address][state]':
        e.target['individual[address][state]'].value,
      'individual[dob][day]': e.target['individual[dob][day]'].value,
      'individual[dob][month]': e.target['individual[dob][month]'].value,
      'individual[dob][year]': e.target['individual[dob][year]'].value
    }

    if (e.target['individual[id_number]'].value) {
      formData['individual[id_number]'] =
        e.target['individual[id_number]'].value
    }

    this.props.updateAccount(this.state.userId, formData)
    this.setState({ accountUpdateModal: false })
  }

  handleCreateAccount = () => {
    this.props.createAccount(this.state.countryCode)
  }

  handleCountry = () => {
    this.setState({ countryPickerModal: true })
  }

  handleCountryClose = (e, item) => {
    this.setState({
      countryPickerModal: false,
      countryCode: item.code,
      countryLabel: item.country,
      countryImage: item.image,
      canCreateAccount: !!item.code
    })
  }

  handleBankAccount (e) {
    e.preventDefault()
    const userCountry = this.props.user.user.country
    if (userCountry === 'BR') {
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
            account_number: accountNumber,
            country: userCountry
          })
        }
      }
      else {
        this.setState({ bankNumberError: true })
      }
    }
    else {
      let accountInfo = {}
      if (userCountry === 'DK' || userCountry === 'BE') {
        accountInfo = {
          account_number: e.target.account_number.value,
          country: userCountry
        }
      }
      else {
        accountInfo = {
          routing_number: e.target.routing_number.value,
          account_number: e.target.account_number.value,
          country: userCountry
        }
      }
      this.props.createBankAccount(this.state.userId, accountInfo)
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
      return [<People />, <Redeem />, <Assignment />][index]
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
                <Tab style={ { margin: 10 } } value={ 0 } label={ this.props.intl.formatMessage(messages.cardTab) } icon={ <Payment type='stripe' notext /> } />
                <Tab style={ { margin: 10 } } value={ 1 } label={ this.props.intl.formatMessage(messages.paypalTab) } icon={ <Payment type='paypal' notext /> } />
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
                              <FormattedMessage id='account.status' defaultMessage='Your account status:' />
                            </Typography>
                            { account.data.requirements.disabled_reason ? (
                              <FormattedMessage id='account.status.pending' defaultMessage='Pending'>
                                { (msg) => (
                                  <Chip
                                    label={
                                      msg
                                    }
                                    style={ { marginRight: 20, backgroundColor: cyan['500'] } }
                                  />
                                ) }
                              </FormattedMessage>
                            ) : (
                              <div>
                                { account.data.external_accounts.total_count ? (
                                  <FormattedMessage id='account.bank.activated' defaultMessage='Activated'>
                                    { (msg) => (
                                      <Chip
                                        label={ msg }
                                        style={ {
                                          color: 'white',
                                          marginRight: 20,
                                          backgroundColor: 'green'
                                        } }
                                      />
                                    ) }
                                  </FormattedMessage>
                                ) : (
                                  <FormattedMessage id='account.bank.missing' defaultMessage='Missing bank data (go to next step)'>
                                    { (msg) => (
                                      <Chip
                                        label={ msg }
                                        style={ {
                                          color: 'white',
                                          marginRight: 20,
                                          backgroundColor: green['500']
                                        } }
                                      />
                                    ) }
                                  </FormattedMessage>
                                ) }
                              </div>
                            ) }
                          </div>
                          { account.data.requirements.currently_due.length ? (
                            <div>
                              <Typography component='p'>
                                <FormattedMessage id='account.pending.title' defaultMessage='We have the following items that needs to be verified:' />
                              </Typography>
                              <div>
                                { account.data.requirements.currently_due.map(
                                  (item, i) => (
                                    Const.ACCOUNT_FIELDS[item] &&
                                    <Chip
                                      style={ { margin: 3 } }
                                      key={ i }
                                      label={ this.props.intl.formatMessage(Const.ACCOUNT_FIELDS[item]) }
                                    />
                                  )
                                ) }
                              </div>
                            </div>
                          ) : (
                            <FormattedMessage id='account.details.complete' defaultMessage='Your account is now verified and you are able to receive all payments from tasks'>
                              { (msg) => (
                                <Chip
                                  style={ { margin: 3 } }
                                  label={ msg }
                                />
                              ) }
                            </FormattedMessage>
                          ) }
                        </CardContent>
                        <CardActions>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='contained'
                            color='primary'
                            onClick={ this.openUpdateModal }
                          >
                            { account.data.requirements.disabled_reason
                              ? <FormattedMessage id='account.activate' defaultMessage='Activate account' />
                              : <FormattedMessage id='account.update' defaultMessage='Update account' /> }
                          </Button>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='contained'
                            color='primary'
                            onClick={ () => this.handleStepTab(1) }
                          >
                            <FormattedMessage id='account.steps.next' defaultMessage='Next step' />
                            <NavigateNext />
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
                            <Grid container spacing={ 3 }>
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
                                    { user.user.country === 'BR' && (
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
                                              }` }
                                              </MenuItem>
                                            )
                                          }
                                        ) }
                                      </Select>
                                    ) }
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
                            <Grid container spacing={ 3 }>
                              <Grid item xs={ 12 }>
                                { (user.user.country !== 'DK' || user.user.country !== 'BE') && (
                                  <FormControl>
                                    <FormattedMessage id='account.details.rountingNumber' defaultMessage='Rounting number'>
                                      { (msg) => (
                                        <Input
                                          id='bank-routing-number'
                                          name='routing_number'
                                          placeholder={ msg }
                                          style={ { marginRight: 20 } }
                                          disabled={ !!bankAccount.data.routing_number }
                                          defaultValue={ bankAccount.data.routing_number }
                                        />
                                      ) }
                                    </FormattedMessage>
                                  </FormControl>
                                ) }
                                <FormControl
                                  error={ this.state.AccountNumberError }
                                >
                                  <FormattedMessage id='account.details.accountNumber' defaultMessage='Account number'>
                                    { (msg) => (
                                      <Input
                                        id='bank-account-number'
                                        name='account_number'
                                        placeholder={ msg }
                                        disabled={ !!bankAccount.data.routing_number }
                                        defaultValue={
                                          bankAccount.data.last4
                                            ? `*****${bankAccount.data.last4}`
                                            : ''
                                        }
                                      />
                                    ) }
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
                              variant='contained'
                              color='primary'
                              type='submit'
                              disabled={ !!bankAccount.data.routing_number }
                            >
                              <FormattedMessage id='account.details.activate.action' defaultMessage='Activate bank account' />
                            </Button>
                            <Button
                              style={ { color: 'white' } }
                              size='large'
                              variant='contained'
                              color='primary'
                              onClick={ () => this.handleStepTab(0) }
                            >
                              <NavigateBefore />
                              <FormattedMessage id='account.steps.bank.previous' defaultMessage='Previous step' />
                            </Button>
                            <Button
                              style={ { color: 'white' } }
                              size='large'
                              variant='contained'
                              color='primary'
                              onClick={ () => this.handleStepTab(2) }
                            >
                              <FormattedMessage id='account.steps.next' defaultMessage='Next step' />
                              <NavigateNext />
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
                                <Grid container spacing={ 3 }>
                                  <Grid item xs={ 12 }>
                                    <Typography color='primary'>
                                      <a
                                        style={ { fontSize: 24 } }
                                        target='_blank'
                                        href={ `https://stripe.com/${user.user.country}/connect-account/legal` }
                                      >
                                        { ' ' }
                                        <FormattedMessage id='account.details.terms.access' defaultMessage='Access Stripe terms' />{ ' ' }
                                      </a>
                                    </Typography>
                                    <FormControl>
                                      <FormattedMessage id='account.details.terms.read' defaultMessage='I read and I accept the Stripe terms to receive transfers about payments directly on my account'>
                                        { (msg) => (
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                checked={ this.state.terms }
                                                onChange={ this.handleTermsChange }
                                                value='terms'
                                                color='primary'
                                              />
                                            }
                                            label={ msg }
                                          />
                                        ) }
                                      </FormattedMessage>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </CardContent>
                              <CardActions>
                                <Button
                                  style={ { color: 'white' } }
                                  size='large'
                                  variant='contained'
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
                                  variant='contained'
                                  color='primary'
                                  onClick={ () => this.handleStepTab(1) }
                                >
                                  <NavigateBefore />
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
                              <Grid container spacing={ 3 }>
                                <Grid item xs={ 12 }>
                                  <Typography color='primary'>
                                    <FormattedMessage id='account.terms.accepted' defaultMessage='You agreed with the terms in ' />
                                    <FormattedDate value={ Moment.unix(
                                      account.data.tos_acceptance.date
                                    ) } />
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                            <CardActions>
                              <Button
                                style={ { color: 'white' } }
                                size='large'
                                variant='contained'
                                color='primary'
                                onClick={ () => this.handleStepTab(1) }
                              >
                                <PreviousIcon />
                                <FormattedMessage id='account.steps.previous' defaultMessage='Previous step' />
                              </Button>
                              <Button
                                style={ { color: 'white' } }
                                size='large'
                                variant='contained'
                                color='primary'
                                onClick={ () => this.handleStepTab(0) }
                              >
                                <FormattedMessage id='account.steps.finish' defaultMessage='Finish' />
                                <Done />
                              </Button>
                            </CardActions>
                          </Card>
                        ) }
                      </div>
                    ) }
                    <Dialog
                      open={ this.state.accountUpdateModal }
                      TransitionComponent={ Transition }
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
                          <Grid container spacing={ 3 }>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <FormattedMessage id='account.verify.business_profile_url' defaultMessage='Website'>
                                  { (msg) => (
                                    <Input
                                      id='payment-form-website'
                                      name='business_profile[url]'
                                      placeholder={ msg }
                                      style={ { marginRight: 20 } }
                                      defaultValue={ account.data.business_profile && account.data.business_profile.url }
                                    />
                                  ) }
                                </FormattedMessage>
                              </FormControl>
                            </Grid>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <FormattedMessage id='account.verify.firstName' defaultMessage='First name'>
                                  { (msg) => (
                                    <Input
                                      id='payment-form-user'
                                      name='individual[first_name]'
                                      placeholder={ msg }
                                      style={ { marginRight: 20 } }
                                      defaultValue={ account.data.individual && account.data.individual.first_name }
                                    />
                                  ) }
                                </FormattedMessage>
                              </FormControl>
                              <FormControl>
                                <FormattedMessage id='account.verify.lastName' defaultMessage='Last name'>
                                  { (msg) => (
                                    <Input
                                      name='individual[last_name]'
                                      id='last-name'
                                      placeholder={ msg }
                                      style={ { marginRight: 20 } }
                                      defaultValue={ account.data.individual && account.data.individual.last_name }
                                    />
                                  ) }
                                </FormattedMessage>
                              </FormControl>
                              <FormControl>
                                <Input
                                  id='payment-form-user'
                                  name='individual[id_number]'
                                  placeholder={
                                    account.data.individual && account.data.individual
                                      .id_number_provided
                                      ? this.props.intl.formatMessage(messages.documentProvided)
                                      : this.props.intl.formatMessage(messages.documentProvide)
                                  }
                                  disabled={
                                    account.data.individual && account.data.individual.id_number_provided
                                  }
                                  defaultValue={
                                    account.data.individual && account.data.individual.id_number
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <Input
                                  id='payment-form-user'
                                  name='individual[address][line1]'
                                  placeholder={ this.props.intl.formatMessage(messages.addressLine1) }
                                  style={ { marginRight: 20 } }
                                  defaultValue={
                                    account.data.individual && account.data.individual.address.line1
                                  }
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  id='payment-form-user'
                                  name='individual[address][line2]'
                                  placeholder={ this.props.intl.formatMessage(messages.addressLine2) }
                                  style={ { marginRight: 20 } }
                                  defaultValue={
                                    account.data.individual && account.data.individual.address.line2
                                  }
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  name='individual[address][postal_code]'
                                  id='postal-code'
                                  placeholder={ this.props.intl.formatMessage(messages.zipCode) }
                                  defaultValue={
                                    account.data.individual && account.data.individual.address.postal_code
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <Input
                                  name='individual[address][city]'
                                  id='adornment-city'
                                  placeholder={ this.props.intl.formatMessage(messages.city) }
                                  style={ { marginRight: 20 } }
                                  defaultValue={
                                    account.data.individual && account.data.individual.address.city
                                  }
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  id='payment-form-user'
                                  name='individual[address][state]'
                                  placeholder={ this.props.intl.formatMessage(messages.state) }
                                  defaultValue={
                                    account.data.individual && account.data.individual.address.state
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={ 12 }>
                              <FormControl>
                                <Input
                                  id='payment-form-user'
                                  name='individual[dob][day]'
                                  placeholder={ this.props.intl.formatMessage(messages.dob) }
                                  style={ { marginRight: 20 } }
                                  defaultValue={ account.data.individual && account.data.individual.dob.day }
                                />
                              </FormControl>
                              <FormControl>
                                <Select
                                  autoWidth
                                  native
                                  name='individual[dob][month]'
                                  style={ { marginRight: 10 } }
                                  onChange={ (event) => {
                                    this.setState({ monthOfBirth: event.target.value })
                                  } }
                                >
                                  <FormattedMessage id='account.details.month' defaultMessage='Month of birth'>{ (msg) => <option value='' key={ 'default' }>{ msg }</option> }</FormattedMessage>
                                  { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                    (item, i) => {
                                      return (
                                        <option selected={ account.data.individual && !!(item === account.data.individual.dob.month) } key={ i } value={ item }>
                                          { `${item}` }
                                        </option>
                                      )
                                    }
                                  ) }
                                </Select>
                              </FormControl>
                              <FormControl>
                                <Input
                                  name='individual[dob][year]'
                                  id='date-of-birth'
                                  placeholder={ this.props.intl.formatMessage(messages.birthYear) }
                                  defaultValue={ account.data.individual && account.data.individual.dob.year }
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
                                  variant='contained'
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
                          { this.state.countryCode && (
                            <div>
                              <Typography component='p' color='textSecondary'>
                                <FormattedMessage id='account.register.country.label' defaultMessage='The country you chose to create your account' />
                              </Typography>
                              <Chip
                                avatar={ <Avatar><img width={ 72 } src={ require(`../../images/countries/${this.state.countryImage}.png`) } /></Avatar> }
                                label={ this.state.countryLabel }
                                className={ classes.chip }
                              />
                            </div>
                          ) }
                        </CardContent>
                        <CardActions className={ classes.cardEmptyActionsAlt }>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='contained'
                            color='primary'
                            onClick={ this.handleCountry }
                          >
                            <FormattedMessage id='account.register.create.country' defaultMessage='Choose your country to start' />
                            <PublicIcon style={ { marginLeft: 10 } } />
                          </Button>
                        </CardActions>
                        <CardActions className={ classes.cardEmptyActions }>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='contained'
                            color='primary'
                            disabled={ !this.state.canCreateAccount }
                            onClick={ this.handleCreateAccount }
                          >
                            <FormattedMessage id='account.register.create.action' defaultMessage='Create account' />
                            <PersonIcon style={ { marginLeft: 10 } } />
                          </Button>
                        </CardActions>
                      </Card> }
                    <CountryPicker open={ this.state.countryPickerModal } onClose={ this.handleCountryClose } />
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
                            { (msg) => (
                              <Chip
                                label={ msg }
                                style={ { marginRight: 20, backgroundColor: 'orange' } }
                              />
                            ) }
                          </FormattedMessage>
                        ) : (
                          <div>
                            <Typography className={ classes.pos } color='textSecondary'>
                              <FormattedMessage id='account.register.account.status' defaultMessage='Account status' />
                            </Typography>
                            <Chip
                              label={ this.props.intl.formatMessage(messages.activeStatus) }
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
                            id='email'
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
                        variant='contained'
                        color='primary'
                        type='submit'
                      >
                        { !user.paypal_id
                          ? <FormattedMessage id='account.register.paypay.activate' defaultMessage='Activate account' />
                          : <FormattedMessage id='account.register.paypay.update' defaultMessage='Update account' />
                        }
                      </Button>
                    </CardActions>
                  </Card>
                </form>
              </TabContainer>
            }
          </div>
        </ReactPlaceholder>
      </div>
    )
  }
}

export default injectIntl(withStyles(styles)(Account))
