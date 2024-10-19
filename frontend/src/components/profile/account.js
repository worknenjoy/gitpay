import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  withStyles,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  Input,
  InputLabel,
  FormControl,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Select,
  Tabs,
  Tab,
} from '@material-ui/core'

import {
  Public as PublicIcon,
  Person as PersonIcon
} from '@material-ui/icons'

import ReactPlaceholder from 'react-placeholder'
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl'
import Moment from 'moment'

import Alert from '../../components/design-library/atoms/alert/alert'

import Const from '../../consts'
import TabContainer from '../Tabs/TabContainer'
import messages from './messages'

import CountryPicker from './country-picker'
import { countryCodes } from './country-codes'
import account from '../../containers/account'

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
    updateUser: PropTypes.func,
    history: PropTypes.object,
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
      monthOfBirth: 0,
      currentTab: 0,
      ibanMode: false,
      currentCountry: '',
      editBankAccount: false,
      bankAccountType: 'individual',
      bankAccountHolderName: ''
    }
    this.openUpdateModal = this.openUpdateModal.bind(this)
    this.closeUpdateModal = this.closeUpdateModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleBankAccount = this.handleBankAccount.bind(this)
    this.handleBankNumberSelect = this.handleBankNumberSelect.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handlePaypalAccount = this.handlePaypalAccount.bind(this)
  }

  componentDidMount () {
    if (this.props.user.logged) {
      const userId = this.props.user.user.id
      this.props.fetchAccount(userId)
      this.props.getBankAccount(userId)
      this.setState({ userId, currentCountry: this.props.user.user.country })
      if(this.props.bankAccount.data.account_holder_type) {
        this.setState({ bankAccountType: this.props.bankAccount.data.account_holder_type })
      }
      if(this.props.bankAccount.data.account_holder_name) {
        this.setState({ bankAccountHolderName: this.props.bankAccount.data.account_holder_name })
      }
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
      'individual[phone]': e.target['individual[phone]'].trim().value,
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
    const { userId, currentCountry, bankAccountType, bankAccountHolderName, editBankAccount } = this.state
    e.preventDefault()
    const userCountry = currentCountry
    if (userCountry === 'BR' && !editBankAccount) {
      const bankNumber = e.target['bank_number'].value
      if (bankNumber) {
        const routingNumber = `${bankNumber}-${e.target.routing_number.value}`
        if (e.target.account_number.value.indexOf('-') > -1) {
          this.setState({ AccountNumberError: true })
        }
        else {
          this.setState({ AccountNumberError: false })
          const accountNumber = e.target.account_number.value.replace('-', '')
          if(editBankAccount) {
            this.props.updateBankAccount({
              account_holder_type: bankAccountType,
              account_holder_name: bankAccountHolderName,
            })
          } else {
            this.props.createBankAccount(userId, this.state.ibanMode ? {
              account_number: accountNumber,
              country: userCountry
            } : {
              routing_number: routingNumber,
              account_number: accountNumber,
              country: userCountry
            })
          }
        }
      }
      else {
        this.setState({ bankNumberError: true })
      }
    }
    else {
      let accountInfo = {}
      if (userCountry === 'DK' || userCountry === 'BE' || this.state.ibanMode) {
        accountInfo = {
          account_number: e.target.account_number.value,
          country: userCountry
        }
      }
      else {
        accountInfo = {
          routing_number: e.target.routing_number.value,
          account_number: e.target.account_number.value,
          account_holder_type: bankAccountType,
          country: userCountry
        }
      }
      if(editBankAccount) {
        this.props.updateBankAccount({
          account_holder_type: bankAccountType,
          account_holder_name: bankAccountHolderName,
        })
      } else {
        this.props.createBankAccount(this.state.userId, accountInfo)
      }
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

  handleIbanModeChange = (e) => {
    e.preventDefault()
    this.setState({ ibanMode: e.target.checked })
  }

  handleEditAccount = () => {
    this.setState({ editBankAccount: true })
  }

  onChange (e) {
    e.preventDefault()
    let formData = {}
    formData[e.target.name] = e.target.value
    this.setState(formData)
  }

  onChangeCountry = (e) => {
    e.preventDefault()
    this.setState({ currentCountry: e.target.value })
  }

  onChangeHolderName = (e) => {
    e.preventDefault()
    this.setState({ bankAccountHolderName: e.target.value })
  }

  render () {
    const { classes, account, bankAccount, user } = this.props
    const { bankAccountType } = this.state

    const getSteps = () => {
      return [
        <FormattedMessage id='account.id.register.bank' defaultMessage='Register bank account' />
      ]
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
            <Tabs
              value={ this.state.currentTab }
              onChange={ this.handleTabChange }
              scrollable
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab style={ { margin: 10 } } value={ 0 } label={ this.props.intl.formatMessage(messages.cardTab) } />
              <Tab style={ { margin: 10 } } value={ 1 } label={ this.props.intl.formatMessage(messages.paypalTab) } />
            </Tabs>
            { this.state.currentTab === 0 &&
              <TabContainer>
                { this.state.editBankAccount && (
                  <Alert severity='info' variant='outlined'>
                  <Typography color='primary'>
                    <FormattedMessage id='account.active.info' defaultMessage='You can edit only some information of your bank account' />
                  </Typography>
                </Alert>
                ) }
                { account.data.id ? (
                  <div>
                    <form
                      onSubmit={ this.handleBankAccount }
                      style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
                    >
                      <Card className={ classes.card }>
                        <CardContent>
                          <Typography variant='h6'>
                            <FormattedMessage id='account.register.bank.title' defaultMessage='Activate bank account:' />
                          </Typography>
                          <Grid container spacing={ 3 }>
                            <Grid item xs={ 12 }>
                              { bankAccount.data.routing_number ? (
                                <div style={{ marginBottom: 8, marginTop: 8 }}>
                                  <Alert
                                    severity='success'
                                    variant='outlined'
                                    action={
                                      <Button
                                        size='small'
                                        onClick={this.handleEditAccount}
                                        variant='contained'
                                        color='primary'
                                      >
                                        <FormattedMessage id='bank.alert.button.edit' defaultMessage='Edit bank account' />
                                      </Button>
                                    }
                                  >
                                    <Typography color='primary'>
                                      <FormattedMessage id='account.active.statement' defaultMessage='Your bank account is active' />
                                    </Typography>
                                  </Alert>
                                </div>
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
                                            <MenuItem key={ i } value={ item }>{ `${Const.BANK_NUMBERS[item]
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
                            <Grid item xs={12}>
                              <FormControl component="fieldset">
                                <Typography variant="caption" gutterBottom>
                                  <FormattedMessage id="account.register.type" defaultMessage="Account Type:" />
                                </Typography>
                                <RadioGroup
                                  aria-label="bankAccountType"
                                  name="bankAccountType"
                                  value={bankAccountType}
                                  onChange={(e) => this.setState({ bankAccountType: e.target.value })}
                                  row
                                >
                                  <FormControlLabel
                                    value="individual"
                                    control={<Radio color="primary" />}
                                    label={<FormattedMessage id="account.type.individual" defaultMessage="Individual" />}
                                    disabled={ !!bankAccount.data.routing_number && !this.state.editBankAccount }
                                  />
                                  <FormControlLabel
                                    value="company"
                                    control={<Radio color="primary" />}
                                    label={<FormattedMessage id="account.type.company" defaultMessage="Company" />}
                                    disabled={ !!bankAccount.data.routing_number && !this.state.editBankAccount }
                                  />
                                </RadioGroup>
                              </FormControl>
                              <FormControl fullWidth>
                                <InputLabel htmlFor='adornment-password'>
                                  <FormattedMessage id='account.register.bank.accountHolderName' defaultMessage='Account holder name / company name' />
                                </InputLabel>
                                <Input
                                  name='account_holder_name'
                                  id='account_holder_name'
                                  disabled={ !!bankAccount.data.routing_number && !this.state.editBankAccount }
                                  value={ this.state.bankAccountHolderName }
                                  onChange={ this.onChangeHolderName }
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container spacing={ 3 }>
                            <Grid item xs={12} md={12}>
                              <FormControl>
                                <div>
                                  <Typography variant='caption' gutterBottom>
                                    <FormattedMessage id='account.register.bank.account' defaultMessage='Country:' />
                                  </Typography>
                                </div>
                                <Select
                                  native
                                  name='country'
                                  value={bankAccount.data.routing_number ? bankAccount.data.country : this.state.currentCountry}
                                  input={<Input id='bank-country' />}
                                  fullWidth
                                  style={{ marginTop: 12, marginBottom: 12 }}
                                  onChange={this.onChangeCountry}
                                  disabled={ !!bankAccount.data.routing_number }
                                >
                                  <option value=''>
                                    Select bank country
                                  </option>
                                  {countryCodes.map((c, index) => (
                                    <option key={index} value={c.code} selected={this.props.user.user.country === c.code}>{c.country}</option>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container spacing={ 3 }>
                            { this.state.ibanMode ? (
                              <Grid item xs={ 12 }>
                                <FormControl
                                  error={ this.state.AccountNumberError }
                                >
                                  <Typography variant='caption' gutterBottom style={{width: '100%'}}>
                                    <FormattedMessage id='account.details.iban' defaultMessage='IBAN' />
                                  </Typography>
                                  <FormattedMessage id='account.details.iban' defaultMessage='IBAN'>
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
                            ) : (
                              <Grid item xs={ 12 }>
                                { (user.user.country !== 'DK' || user.user.country !== 'BE') && (
                                  <>
                                   
                                    <FormControl>
                                      <Typography variant='caption' gutterBottom style={{width: '100%'}}>
                                        <FormattedMessage id='account.register.bank.routing' defaultMessage='Routing number' />
                                      </Typography>
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
                                  </>
                                ) }
                                <FormControl
                                  error={ this.state.AccountNumberError }
                                >
                                  <Typography variant='caption' gutterBottom style={{width: '100%'}}>
                                    <FormattedMessage id='account.register.bank.accountNumber' defaultMessage='Account number' />
                                  </Typography>
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
                            ) }
                            <Grid item xs={ 12 }>
                              { user.user.country !== 'BR' && !bankAccount.data.routing_number && (
                                <FormControl>
                                  <FormattedMessage
                                    id='account.details.bank.mode.iban'
                                    defaultMessage='I want to provide my IBAN number instead'
                                  >
                                    { (msg) => (
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            name='iban'
                                            checked={ this.state.ibanMode }
                                            onChange={ this.handleIbanModeChange }
                                            value='iban'
                                            color='primary'
                                          />
                                        }
                                        label={ msg }
                                      />
                                    ) }
                                  </FormattedMessage>
                                </FormControl>
                              ) }
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions style={ { justifyContent: 'flex-end' } }>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={ !this.state.editBankAccount && bankAccount.data.routing_number }
                          >
                            {this.state.editBankAccount ? (
                              <FormattedMessage id='account.details.update.action' defaultMessage='Update bank account' />
                            ) : (
                              <FormattedMessage id='account.details.activate.action' defaultMessage='Activate bank account' />
                            )}
                          </Button>
                        </CardActions>
                      </Card>
                    </form>
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
                                avatar={ <Avatar><img width={ 72 } src={ require(`../../images/countries/${this.state.countryImage}.png`).default } /></Avatar> }
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
                    <CardActions style={ { justifyContent: 'end' } }>
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

export default withRouter(injectIntl(withStyles(styles)(Account)))
