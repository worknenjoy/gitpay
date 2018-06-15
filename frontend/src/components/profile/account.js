import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ReactPlaceholder from 'react-placeholder';

import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';
import Input from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Stepper from 'material-ui/Stepper';
import Step from 'material-ui/Stepper/Step';
import StepButton from 'material-ui/Stepper/StepButton';
import Switch from 'material-ui/Switch';

import UserIcon from 'material-ui-icons/AccountCircle';
import RedeemIcon from 'material-ui-icons/Redeem';
import AssignmentIcon from 'material-ui-icons/Assignment'


import Const from '../../consts';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = (theme) => ({
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
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  label: {

  }
});

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountUpdateModal: false,
      currentStep: 0,
      terms: false
    };
    this.openUpdateModal = this.openUpdateModal.bind(this);
    this.closeUpdateModal = this.closeUpdateModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleBankAccount = this.handleBankAccount.bind(this);
    this.handleAcceptTerms = this.handleAcceptTerms.bind(this);
    this.handleTermsChange = this.handleTermsChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchAccount();
    this.props.getBankAccount();
  }

  openUpdateModal() {
    this.setState({accountUpdateModal: true});
  }

  closeUpdateModal() {
    this.setState({accountUpdateModal: false});
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = {...this.state };
    delete formData.accountUpdateModal;
    this.props.updateAccount(formData);
    this.setState({accountUpdateModal: false});
  }

  handleBankAccount(e) {
    e.preventDefault();
    const routingNumber = e.target.routing_number.value;
    const accountNumber = e.target.account_number.value;
    this.props.createBankAccount({
      routing_number: routingNumber,
      account_number: accountNumber
    });
  }

  handleStepTab(index) {
    this.setState({currentStep: index});
  }

  handleTermsChange(e) {
    e.preventDefault();
    const terms = e.target.value == 'terms' ? true : false;
    this.setState({ terms });
  }

  handleAcceptTerms(e) {
    e.preventDefault();
    if(this.state.terms) {
      this.props.updateAccount({
        tos_acceptance: {
          date: Math.round(+new Date() / 1000)
        }
      });
    }
  }

  onChange(e) {
    e.preventDefault();
    let formData = {};
    formData[e.target.name] = e.target.value;
    this.setState(formData);
  }

  render() {

    const { classes, account, bankAccount } = this.props;

    const getSteps = () => {
      return ['Verificar identidade', 'Registrar conta bancária', 'Aceitar termos de uso'];
    }

    const getStepsIcon = (index) => {
      return [<UserIcon/>, <RedeemIcon />, <AssignmentIcon/>][index];
    }

    const getStepContent = (step) => {
      return getSteps()[step];
    }

    const steps = getSteps();

    return (
      <ReactPlaceholder showLoadingAnimation={true} type='media' rows={5} ready={account.completed && !account.error.error}>
      <div>
        { account.data.id ? (
        <div>
          <Stepper nonLinear activeStep={this.state.currentStep}>
            {steps.map((label, index) => {
              return (
                <Step key={index}>
                  <StepButton onClick={() => this.handleStepTab(index)} icon={getStepsIcon(index)}>
                    { label }
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
          { this.state.currentStep === 0 &&
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.title}>
                <Typography className={classes.pos} color="textSecondary">
                  Status da sua conta:
                </Typography>
                { account.data.verification.disabled_reason ? (
                  <Chip label={Const.ACCOUNT_REASONS[account.data.verification.disabled_reason]} style={{marginRight: 20, backgroundColor: 'orange'}} />
                ) : (
                  <Chip label={`Ativada`} style={{color: 'white', marginRight: 20, backgroundColor: 'green'}} />
                )}
              </div>
              { account.data.verification.fields_needed.length > 0 &&
                <div>
                  <Typography className={classes.pos} color="textSecondary">
                    Entraremos em contato para finalizar a validação da sua conta através do e-mail: <br/>
                    <strong>{ account.data.email }</strong>
                  </Typography>
                  <Typography component="p">
                    {`Temos os seguintes campos a serem verificados:`}
                  </Typography>
                  <div>
                    { account.data.verification.fields_needed.map((item,i) => (
                        <Chip style={{margin: 3}} key={i} label={`${Const.ACCOUNT_FIELDS[item]}`} />
                      )
                    )}
                  </div>
              </div>
              }
            </CardContent>
            <CardActions>
              <Button
                style={{color: 'white'}}
                size="large"
                variant="raised"
                color="primary"
                onClick={this.openUpdateModal}
              >
                Validar conta
              </Button>
            </CardActions>
          </Card>}
          { this.state.currentStep === 1 &&
          <form onSubmit={this.handleBankAccount} style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
            <Card className={classes.card}>
              <CardContent>
                <div style={{marginBottom: 10}}>
                  <Typography>
                    {getStepContent(1)}
                  </Typography>
                </div>
                <Typography className={classes.pos} gutterBottom>
                  Entre com os dados da sua conta no formato seguinte: <br />
                  <strong>xxx-xxxxxx</strong> <br />
                  Sendo a primeira parte o número do banco seguindo do número da agência. <br />
                </Typography>
                <Typography color="primary" gutterBottom>
                  Você pode consultar o <a href="https://pt.wikipedia.org/wiki/Lista_de_bancos_do_Brasil" target="_blank">código do seu banco aqui</a>
                </Typography>
                <Typography className={classes.pos} gutterBottom>
                  Lembre-se que é possível alterar uma conta bancária depois de verificada, então verifique se seus dados estão corretos <br />
                  Se desejar modificar sua conta bancária, terá que adicionar uma nova entrando em contato
                  com tarefas@gitpay.me
                </Typography>
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
                      <FormControl>
                        <Input
                          id="bank-routing-number"
                          name="routing_number"
                          placeholder="Agência"
                          style={{marginRight: 20}}
                          disabled={bankAccount.data.routing_number ? true : false}
                          defaultValue={bankAccount.data.routing_number}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          id="bank-account-number"
                          name="account_number"
                          placeholder="Número da conta"
                          disabled={bankAccount.data.routing_number ? true : false}
                          defaultValue={bankAccount.data.account_number || ` *****${ bankAccount.data.last4 }` || ''}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
              </CardContent>
              <CardActions>
                <Button
                  style={{color: 'white'}}
                  size="large"
                  variant="raised"
                  color="primary"
                  type="submit"
                  disabled={bankAccount.data.routing_number ? true : false}
                >
                  Validar conta
                </Button>
              </CardActions>
            </Card>
          </form>
          }
          { this.state.currentStep === 2 &&
          <form onSubmit={this.handleAcceptTerms} style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
            <Card className={classes.card}>
              <CardContent>
                <div style={{marginBottom: 20}}>
                  <Typography component="title">
                    {getStepContent(2)}
                  </Typography>
                </div>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Typography color="primary">
                      <a target="_blank" href="https://stripe.com/br/connect-account/legal"> Acessar termos de uso do Stripe </a>
                    </Typography>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.terms}
                            onChange={this.handleTermsChange}
                            value="terms"
                            color="primary"
                          />
                        }
                        label="Eu li e aceito os termos do Stripe para receber transferências dos pagamentos para minha conta" />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  style={{color: 'white'}}
                  size="large"
                  variant="raised"
                  color="primary"
                  type="submit"
                  disabled={!this.state.terms}
                  onClick={this.handleAcceptTerms}
                >
                  Aceitar termos
                </Button>
              </CardActions>
            </Card>
          </form>}
          <Dialog
            open={this.state.accountUpdateModal}
            transition={Transition}
            onClose={this.closeUpdateModal}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-slide-title">
              Verificar conta
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Preecha os dados para verificar sua conta
              </DialogContentText>
              <form onSubmit={this.handleSubmit} onChange={this.onChange} style={{marginTop: 20, marginBottom: 20, width: '100%'}}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <FormControl>
                      <Input
                        id="payment-form-user"
                        name="legal_entity[first_name]"
                        placeholder="Primeiro nome"
                        style={{marginRight: 20}}
                        defaultValue={account.data.legal_entity.first_name}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        name="legal_entity[last_name]"
                        id="adornment-email"
                        placeholder="Último nome"
                        defaultValue={account.data.legal_entity.last_name}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <Button color="primary" onClick={this.closeUpdateModal}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="raised" color="secondary">
                        {`Atualizar conta`}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>

        </div>
        ) : (
          <Card className={classes.cardEmpty}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
              Você não tem nenhuma cadastrada para recebimento
              </Typography>
            </CardContent>
            <CardActions className={classes.cardEmptyActions}>
              <Button
                style={{color: 'white'}}
                size="large"
                variant="raised"
                color="primary"
                onClick={() => this.props.createAccount()}
              >
                Criar conta
              </Button>
            </CardActions>
          </Card>
          )
        }
      </div>
      </ReactPlaceholder>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Account);
