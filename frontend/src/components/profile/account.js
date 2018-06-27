import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import ReactPlaceholder from 'react-placeholder'
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
import Input from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import MenuItem from 'material-ui/Menu/MenuItem'
import FormHelperText from 'material-ui/Form/FormHelperText'
import FormControlLabel from 'material-ui/Form/FormControlLabel'
import Stepper from 'material-ui/Stepper'
import Step from 'material-ui/Stepper/Step'
import StepButton from 'material-ui/Stepper/StepButton'
import Switch from 'material-ui/Switch'
import Select from 'material-ui/Select'

import UserIcon from 'material-ui-icons/AccountCircle'
import RedeemIcon from 'material-ui-icons/Redeem'
import AssignmentIcon from 'material-ui-icons/Assignment'
import NextIcon from 'material-ui-icons/NavigateNext'
import PreviousIcon from 'material-ui-icons/ArrowBack'
import ConcludeIcon from 'material-ui-icons/Done'

import Const from '../../consts'

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

class Account extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accountUpdateModal: false,
      currentStep: 0,
      userId: null,
      selectedBank: '',
      bankNumberError: false,
      terms: false
    }
    this.openUpdateModal = this.openUpdateModal.bind(this)
    this.closeUpdateModal = this.closeUpdateModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleBankAccount = this.handleBankAccount.bind(this)
    this.handleAcceptTerms = this.handleAcceptTerms.bind(this)
    this.handleTermsChange = this.handleTermsChange.bind(this)
    this.handleBankNumberSelect = this.handleBankNumberSelect.bind(this)
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
      const accountNumber = e.target.account_number.value
      this.props.createBankAccount(this.state.userId, {
        routing_number: routingNumber,
        account_number: accountNumber
      })
    }
    else {
      this.setState({ bankNumberError: true })
    }
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
        'Verificar identidade',
        'Registrar conta bancária',
        'Aceitar termos de uso'
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
      <ReactPlaceholder
        showLoadingAnimation
        type='media'
        rows={ 5 }
        ready={ account.completed && !account.error.error }
      >
        <div>
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
                        Status da sua conta:
                      </Typography>
                      { account.data.verification.disabled_reason ? (
                        <Chip
                          label={
                            Const.ACCOUNT_REASONS[account.data.verification.disabled_reason]
                          }
                          style={ { marginRight: 20, backgroundColor: 'orange' } }
                        />
                      ) : (
                        <Chip
                          label={ 'Ativada' }
                          style={ {
                            color: 'white',
                            marginRight: 20,
                            backgroundColor: 'green'
                          } }
                        />
                      ) }
                    </div>
                    { account.data.verification.disabled_reason ===
                      'fields_needed' && (
                      <div>
                        <Typography component='p'>
                          { 'Temos os seguintes campos a serem verificados:' }
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
                        ? 'Ativar conta'
                        : 'Atualizar conta' }
                    </Button>
                    <Button
                      style={ { color: 'white' } }
                      size='large'
                      variant='raised'
                      color='primary'
                      onClick={ () => this.handleStepTab(1) }
                    >
                      Próximo passo
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
                              Sua conta bancária está ativa
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
                                  <em>Selecione o número do banco</em>
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
                                  Por favor selecione o banco
                                </FormHelperText>
                              ) }
                            </FormControl>
                          ) }
                        </Grid>
                      </Grid>
                      <Grid container spacing={ 24 }>
                        <Grid item xs={ 12 }>
                          <FormControl>
                            <Input
                              id='bank-routing-number'
                              name='routing_number'
                              placeholder='Agência'
                              style={ { marginRight: 20 } }
                              disabled={ !!bankAccount.data.routing_number }
                              defaultValue={ bankAccount.data.routing_number }
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              id='bank-account-number'
                              name='account_number'
                              placeholder='Número da conta'
                              disabled={ !!bankAccount.data.routing_number }
                              defaultValue={
                                bankAccount.data.last4
                                  ? `*****${bankAccount.data.last4}`
                                  : ''
                              }
                            />
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
                        Ativar conta bancária
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
                        Próximo passo
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
                                  Acessar termos de uso do Stripe{ ' ' }
                                </a>
                              </Typography>
                              <FormControl>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={ this.state.terms }
                                      onChange={ this.handleTermsChange }
                                      value='terms'
                                      color='primary'
                                    />
                                  }
                                  label='Eu li e aceito os termos do Stripe para receber transferências dos pagamentos para minha conta'
                                />
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
                            Aceitar termos
                          </Button>
                          <Button
                            style={ { color: 'white' } }
                            size='large'
                            variant='raised'
                            color='primary'
                            onClick={ () => this.handleStepTab(1) }
                          >
                            <PreviousIcon />
                            Passo anterior
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
                              Você aceitou os termos em{ ' ' }
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
                          Passo anterior
                        </Button>
                        <Button
                          style={ { color: 'white' } }
                          size='large'
                          variant='raised'
                          color='primary'
                          onClick={ () => this.handleStepTab(0) }
                        >
                          Concluir
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
              >
                <DialogTitle id='alert-dialog-slide-title'>
                  Verificar conta
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-slide-description'>
                    Preecha os dados para verificar sua conta
                  </DialogContentText>
                  <form
                    onSubmit={ this.handleSubmit }
                    onChange={ this.onChange }
                    style={ { marginTop: 20, marginBottom: 20, width: '100%' } }
                  >
                    <Grid container spacing={ 24 }>
                      <Grid item xs={ 12 }>
                        <FormControl>
                          <Input
                            id='payment-form-user'
                            name='legal_entity[first_name]'
                            placeholder='Primeiro nome'
                            style={ { marginRight: 20 } }
                            defaultValue={ account.data.legal_entity.first_name }
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            name='legal_entity[last_name]'
                            id='adornment-email'
                            placeholder='Último nome'
                            style={ { marginRight: 20 } }
                            defaultValue={ account.data.legal_entity.last_name }
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            id='payment-form-user'
                            name='legal_entity[personal_id_number]'
                            placeholder={
                              account.data.legal_entity
                                .personal_id_number_provided
                                ? 'CPF fornecido'
                                : 'Número do CPF'
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
                            placeholder='Endereço'
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
                            placeholder='Complemento'
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
                            placeholder='CEP'
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
                            placeholder='Cidade'
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
                            placeholder='Estado'
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
                            placeholder='Dia do nascimento'
                            style={ { marginRight: 20 } }
                            defaultValue={ account.data.legal_entity.dob.day }
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            name='legal_entity[dob][month]'
                            id='adornment-email'
                            placeholder='Mês do nascimento'
                            defaultValue={ account.data.legal_entity.dob.month }
                            style={ { marginRight: 10 } }
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            name='legal_entity[dob][year]'
                            id='adornment-email'
                            placeholder='Ano do nascimento'
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
                            Cancelar
                          </Button>
                          <Button
                            type='submit'
                            variant='raised'
                            color='secondary'
                          >
                            { 'Atualizar conta' }
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Card className={ classes.cardEmpty }>
              <CardContent>
                <Typography className={ classes.title } color='textSecondary'>
                  Você não tem nenhuma cadastrada para recebimento
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
                  Criar conta
                </Button>
              </CardActions>
            </Card>
          ) }
        </div>
      </ReactPlaceholder>
    )
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  createAccount: PropTypes.func,
  bankAccount: PropTypes.func,
  account: PropTypes.object,
  createBankAccount: PropTypes.func,
  updateAccount: PropTypes.func,
  fetchAccount: PropTypes.func,
  getBankAccount: PropTypes.func
}

export default withStyles(styles)(Account)
