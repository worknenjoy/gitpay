import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
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
      accountUpdateModal: false
    }
    this.openUpdateModal = this.openUpdateModal.bind(this);
    this.closeUpdateModal = this.closeUpdateModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchAccount();
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

  onChange(e) {
    e.preventDefault();
    let formData = {};
    formData[e.target.name] = e.target.value;
    this.setState(formData);
  }

  render() {

    const { classes, account } = this.props;

    return (
      <div>
        { account.data.id ? (
        <div>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.title}>
                <Typography className={classes.pos} color="textSecondary">
                  Status da sua conta:
                </Typography>
                <Chip label={Const.ACCOUNT_REASONS[account.data.verification.disabled_reason]} style={{marginRight: 20, backgroundColor: 'orange'}} />
              </div>
              <Typography className={classes.pos} color="textSecondary">
                Entraremos em contato para finalizar a validação da sua conta para recebimento através do e-mail: <br/>
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
          </Card>
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
                        ref="payment-form-user"
                        style={{marginRight: 20}}
                        defaultValue={account.data.legal_entity.first_name}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        name="legal_entity[last_name]"
                        id="adornment-email"
                        placeholder="Último nome"
                        ref="payment-form-email"
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
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Account);
