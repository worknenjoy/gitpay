import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MomentComponent from 'moment';

import Grid from 'material-ui/Grid';
import Notification from '../notification/notification';
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import RedeemIcon from 'material-ui-icons/Redeem';
import ShoppingBasket from 'material-ui-icons/ShoppingBasket';
import AddIcon from 'material-ui-icons/Add';
import TrophyIcon from 'material-ui-icons/AccountBalanceWallet';
import DateIcon from 'material-ui-icons/DateRange';
import CalendarIcon from 'material-ui-icons/PermContactCalendar';
import GroupWorkIcon from 'material-ui-icons/GroupAdd';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Chip from 'material-ui/Chip';
import PaymentDialog from '../payment/payment-dialog';

import StatsCard from '../Cards/StatsCard';
import RegularCard from '../Cards/RegularCard';
import Table from '../Table/Table';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import axios from 'axios';

import marked from 'marked';
import renderHTML from 'react-render-html';

import TopBarContainer from '../../containers/topbar';
import Bottom from '../bottom/bottom';

const paymentIcon = require('../../images/payment-icon-alt.png');
const timeIcon = require('../../images/time-icon.png');

const logoGithub = require('../../images/github-logo.png');
const logoBitbucket = require('../../images/bitbucket-logo.png');

import Constants from '../../consts';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  rootTopBar: {
    flexGrow: 1,
    backgroundColor: 'black',
    height: 180,
  },
  rootTabs: {
    flexGrow: 1,
    marginBottom: 40,
    backgroundColor: theme.palette.text.secondary
  },
  formPayment: {
    marginTop: 10,
    marginBottom: 10
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 40,
    height: 40,
  },
  chipContainer: {
    marginTop: 12,
    marginBottom: 12
  },
  chip: {
    marginRight: 10,
    marginBottom: 20
  },
  chipStatus: {
    marginLeft: 20,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  typo: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -30,
    paddingTop: 10,
    paddingBottom: 20
  },
  typoSmall: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 20,
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
    marginTop: 10,
    color: 'white'
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
  avatar: {
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
  parentCard: {
    marginTop: 40,
    marginLeft: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  otherCard: {
    maxWidth: 280,
    marginRight: 10,
    marginBottom: 40,
    textAlign: 'center'
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
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
  card: {
    display: 'flex',
    marginBottom: 20
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
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
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  light: {
    color: 'white'
  }
});

class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: true,
      task: {
        company: "loading",
        issue: {
          title: "loading",
          body: "loading",
          user: {
            avatar_url: 'loading',
            name: 'loading'
          },
        },
        url: "loading",
        orders: []
      },
      payment: {
        dialog: false,
      },
      deadline: null,
      final_price: 0,
      current_price: 0,
      order_price: 0,
      active_tab: 0,
      assignDialog: false,
      notification: {
        open: false,
        message: "loading"
      }
    }

    this.handleCloseLoginNotification = this.handleCloseLoginNotification.bind(this);
    this.handlePaymentDialogClose = this.handlePaymentDialogClose.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleDeadline = this.handleDeadline.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputChangeCalendar = this.handleInputChangeCalendar.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleAssignDialogClose = this.handleAssignDialogClose.bind(this);
    this.handleAssignDialogOpen = this.handleAssignDialogOpen.bind(this);
    this.handleAssignTask = this.handleAssignTask.bind(this);
  }

  componentWillMount() {
    axios.get(api.API_URL + `/tasks/fetch/${this.props.match.params.id}`).then((task) => {
      this.setState({task: {issue: task.data.metadata.issue, status: task.data.status, url: task.data.url, orders: task.data.orders, assigns: task.data.assigns, company: task.data.metadata.company}, deadline: task.data.deadline, final_price: task.data.value, order_price: task.data.value});
    }).catch((e) => {
      console.log('not possible to fetch issue');
      console.log(e);
    });
    if(this.props.match.path == "/task/:id/orders") {
      this.setState({active_tab: 1});
    }
  }

  componentWillReceiveProps(newProp) {
    if(newProp.match.path == "/task/:id/orders") {
      this.setState({active_tab: 1});
    }
    if(newProp.location.state){
      this.setState(newProp.location.state);
    }
  }

  handleCloseLoginNotification() {
    this.setState({created: false});
  }

  handleCloseNotification() {
    this.setState({notification: {open: false}});
  }

  handlePayment() {
    this.setState({payment: {dialog: true}});
  }

  handlePaymentDialogClose(e) {
    this.setState({payment: {dialog: false}});
  }

  handleDeadline() {
    axios.put(api.API_URL + `/tasks/update/`, {
      id: this.props.match.params.id,
      deadline: this.state.deadline
    }).then((task) => {
      if(task.data.id) {
        this.setState({
          notification: {
            open: true,
            message: "A data foi escolhida com sucesso"
          }
        });
      } else {
        this.setState({
          notification: {
            open: true,
            message: "A data não foi atualizada, por favor tente novamente"
          }
        });
      }
    }).catch((e) => {
      this.setState({
        notification: {
          open: true,
          message: "Não foi possível atualizar a data"
        }
      });
      console.log('not possible to update task');
      console.log(e);
    });
  }

  pickTaskPrice(price) {
    this.setState({current_price: price, final_price: parseInt(price) + parseInt(this.state.order_price)});
  }

  pickTaskDeadline(time) {
    const date = MomentComponent(this.state.deadline).isValid() ? MomentComponent(this.state.deadline) : MomentComponent();
    const newDate = date.add(time, 'days').format();
    this.setState({deadline: newDate});
  }

  handleClose() {
    this.setState({payment: {dialog: false}});
  }

  handleInputChange(e) {
    this.setState({current_price: e.target.value});
  }

  handleInputChangeCalendar(e) {
    this.setState({deadline: e.target.value});
  }

  handleTabChange(event, tab) {
    this.setState({ active_tab: tab });
  }

  handleAssignDialogClose() {
    this.setState({assignDialog: false});
  }

  handleAssignDialogOpen() {
    this.setState({assignDialog: true});
  }

  handleAssignTask() {
    this.props.updateTask({
      id: this.props.match.params.id,
      Assigns: [{
        userId: this.props.user.id
      }]
    });
    this.setState({assignDialog: false, active_tab: 2});
  }

  render() {

    const { classes } = this.props;
    const activeTab = this.state.active_tab;
    const TabContainer = (props) => {
      return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {props.children}
        </Typography>
      );
    }

    const statuses =  {
      'open': 'Em aberto',
      'succeeded': 'Realizado com sucesso',
      'fail': 'Falha no pagamento'
    }

    const displayOrders = (orders) => {
      if(!orders.length) {
        return [];
      }
      return orders.map((item, i) => [item.paid ? 'Sim' : 'Não', statuses[item.status] || 'Não processado', `R$ ${item.amount}`, MomentComponent(item.updatedAt).fromNow()])
    }

    const displayAssigns = (assign) => {
      if(!assign.length) {
        return [];
      }
      const items = assign.map((item, i) => {
        return [`${item.User.name}` || 'Sem nome', MomentComponent(item.updatedAt).fromNow()]
      });
      return items;
    }

    return (
      <div>
        <Grid container className={classes.rootTopBar} spacing={24} >
          <TopBarContainer />
          <Grid item xs={12}>
            <Typography variant="subheading" color="primary" align="left" className={classes.typoSmall} gutterBottom>
              <a className={classes.white} href={this.state.task.url}>{this.state.task.company}</a>
            </Typography>
            <Typography variant="display1" color="primary" align="left" className={classes.typo} gutterBottom>
              <a className={classes.white} href={this.state.task.url}>{this.state.task.issue.title}</a>
              <Chip
                label={Constants.STATUSES[this.state.task.status]}
                className={classes.chipStatus}
              />
            </Typography>
          </Grid>
          <Notification message={this.state.notification.message} open={this.state.notification.open} onClose={this.handleCloseNotification} />
        </Grid>
        <Grid container justify="flex-start" direction="row" spacing={24} className={classes.gridBlock}>
          <Grid item xs={8} style={{display: 'flex', alignItems: 'center', marginTop: 12}}>
            <div>
              <Avatar
                alt={this.state.task.issue.user.name}
                src={this.state.task.issue.user.avatar_url}
                className={classNames(classes.avatar)}
              />
            </div>
            <div className={classes.paper}>
              <Button onClick={this.handleAssignDialogOpen} size="medium" color="primary" className={classes.altButton}>
                <span className={classes.spaceRight}>Tenho interesse nesta tarefa!</span>  <AddIcon />
              </Button>
              <Dialog
                open={this.state.assignDialog}
                onClose={this.handleAssignDialogClose}
                aria-labelledby="form-dialog-title"
              >
                { !this.props.logged ? (
                <div>
                  <DialogTitle id="form-dialog-title">Você precisa estar logado para realizar esta tarefa</DialogTitle>
                  <DialogContent>
                    <div className={classes.mainBlock}>
                      <Typography type="subheading" gutterBottom noWrap>
                        Conecte com algumas dessas contas
                      </Typography>
                      <Button style={{marginRight: 10}} href={`${api.API_URL}/authorize/github`} variant="raised" size="large" color="secondary" className={classes.altButton}>
                        <img width="16" src={logoGithub} /> Github
                      </Button>
                      <Button href={`${api.API_URL}/authorize/bitbucket`} variant="raised" size="large" color="secondary" className={classes.altButton}>
                        <img width="16" src={logoBitbucket} /> Bitbucket
                      </Button>
                    </div>
                  </DialogContent>
                </div>
                  ) : (
                    <div>
                      <DialogTitle id="form-dialog-title">Você tem interesse nesta tarefa?</DialogTitle>
                      <DialogContent>
                        <Typography type="subheading" gutterBottom>
                          Você poderá ser associado a tarefa no github para receber a recompensa quando o seu código for integrado
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleAssignDialogClose} color="primary">
                          Cancelar
                        </Button>
                        <Button onClick={this.handleAssignTask} variant="raised" color="secondary" >
                          Desafio aceito, quero esta tarefa!
                        </Button>
                      </DialogActions>
                    </div>
                  )}
              </Dialog>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.gridBlock}>
            <Grid item xs={8}>
              <div className={classes.rootTabs}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={activeTab}
                    onChange={this.handleTabChange}
                    scrollable
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Tarefa" icon={<RedeemIcon />} />
                    <Tab label="Pedidos" icon={<ShoppingBasket />} />
                    <Tab label="Interessados" icon={<GroupWorkIcon />} />
                  </Tabs>
                </AppBar>
                {activeTab === 0 &&
                <TabContainer>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cover}
                      image={paymentIcon}
                      title="Realize o pagamento pela tarefa"
                    />
                    <div className={classes.details}>
                      <CardContent className={classes.content}>
                        <Typography variant="headline">Crie uma recompensa para esta tarefa</Typography>
                        <Typography variant="subheading" color="textSecondary">
                          Realize um pagamento por esta tarefa para que alguém possa desenvolvê-la e receber o pagamento como recompensa.
                        </Typography>
                        <div className={classes.chipContainer}>
                          <Chip
                            label=" R$ 20"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(20)}
                          />
                          <Chip
                            label=" R$ 50"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(50)}
                          />
                          <Chip
                            label=" R$ 100"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(100)}
                          />
                          <Chip
                            label=" R$ 150"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(150)}
                          />
                          <Chip
                            label=" R$ 300"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(300)}
                          />
                        </div>
                        <form className={classes.formPayment} action="POST">
                          <FormControl fullWidth>
                            <InputLabel htmlFor="adornment-amount">Valor</InputLabel>
                            <Input
                              id="adornment-amount"
                              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                              placeholder="Insira um valor"
                              type="number"
                              inputProps={ {'min': 0} }
                              value={this.state.current_price}
                              onChange={this.handleInputChange}
                            />
                          </FormControl>
                          <Button disabled={!this.state.current_price} onClick={this.handlePayment} variant="raised" color="primary" className={classes.btnPayment}>
                            {`Pagar R$ ${this.state.current_price}`}
                          </Button>
                        </form>
                        <PaymentDialog
                          open={this.state.payment.dialog}
                          onClose={this.handleClose}
                          itemPrice={this.state.current_price}
                          price={this.state.final_price}
                          task={this.props.match.params.id}
                        />
                      </CardContent>
                      <div className={classes.controls}>
                      </div>
                    </div>
                  </Card>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cover}
                      image={timeIcon}
                      title="Realize o pagamento pela tarefa"
                    />
                    <div className={classes.details}>
                      <CardContent className={classes.content}>
                        <Typography variant="headline">Escolha uma data limite para realizacao desta tarefa</Typography>
                        <Typography variant="subheading" color="textSecondary">
                          Escolha uma data em que deseja que ela precisa ser finalizada
                        </Typography>
                        <div className={classes.chipContainer}>
                          <Chip
                            label=" daqui uma semana "
                            className={classes.chip}
                            onClick={() => this.pickTaskDeadline(7)}
                          />
                          <Chip
                            label=" daqui quinze dias "
                            className={classes.chip}
                            onClick={() => this.pickTaskDeadline(15)}
                          />
                          <Chip
                            label=" daqui vinte dias "
                            className={classes.chip}
                            onClick={() => this.pickTaskDeadline(20)}
                          />
                          <Chip
                            label=" daqui um mês"
                            className={classes.chip}
                            onClick={() => this.pickTaskDeadline(30)}
                          />
                        </div>
                        <form className={classes.formPayment} action="POST">
                          <FormControl fullWidth>
                            <InputLabel htmlFor="adornment-amount">Dia</InputLabel>
                            <Input
                              id="adornment-date"
                              startAdornment={<InputAdornment position="start"><DateIcon /></InputAdornment>}
                              placeholder="Insira uma data"
                              type="date"
                              value={`${MomentComponent(this.state.deadline).format("YYYY-MM-DD")}` || `${MomentComponent().format("YYYY-MM-DD")}`}
                              onChange={this.handleInputChangeCalendar}
                            />
                          </FormControl>
                          <Button disabled={!this.state.deadline} onClick={this.handleDeadline} variant="raised" color="primary" className={classes.btnPayment}>
                            {this.state.deadline ? `Escolher ${MomentComponent(this.state.deadline).format("DD/MM/YYYY")} como data limite` : 'Salvar data limite'}
                          </Button>
                        </form>
                        <PaymentDialog
                          open={this.state.payment.dialog}
                          onClose={this.handleClose}
                          itemPrice={this.state.current_price}
                          price={this.state.final_price}
                          task={this.props.match.params.id}
                        />
                      </CardContent>
                      <div className={classes.controls}>
                      </div>
                    </div>
                  </Card>
                  <Card className={classes.paper}>
                    <Typography variant="title" align="left" gutterBottom>
                      Descrição
                    </Typography>
                    <Typography variant="body2" align="left" gutterBottom>
                      <div>
                        {renderHTML(marked(this.state.task.issue.body))}
                      </div>
                    </Typography>
                  </Card>
                </TabContainer>}
                {activeTab === 1 &&
                <div style={{marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20}}>
                <RegularCard
                  headerColor="green"
                  cardTitle="Pagamentos realizados para esta tarefa"
                  cardSubtitle="Elas serão transferidas para quem conclui-la"
                  content={
                    <Table
                      tableHeaderColor="warning"
                      tableHead={["Pago", "Status", "Valor", "Criado em"]}
                      tableData={this.state.task.orders.length ? displayOrders(this.state.task.orders) : []}
                    />
                  }
                />
                </div>}
                {activeTab === 2 &&
                <div style={{marginTop: 20, marginBottom: 30, marginRight: 20, marginLeft: 20}}>
                  <RegularCard
                    headerColor="green"
                    cardTitle="Interessados em realizar esta tarefa"
                    cardSubtitle="Estes são usuários interessados em realizar esta tarefa"
                    content={
                      <Table
                        tableHeaderColor="warning"
                        tableHead={["Nome", "Criado em"]}
                        tableData={this.state.task.assigns.length ? displayAssigns(this.state.task.assigns) : []}
                      />
                    }
                  />
                </div>}
              </div>
            </Grid>
            <Grid item xs={4}>
              <StatsCard
                icon={TrophyIcon}
                iconColor="green"
                title="Valor da tarefa"
                description={`R$ ${this.state.final_price}`}
                statIcon={CalendarIcon}
                statText={this.state.task.orders.length ? `Valores recebidos de ${this.state.task.orders.map((item,i) => `R$ ${item.amount}`)} `: 'Nenhum valor recebido'}
              />
              {MomentComponent(this.state.deadline).isValid() &&
              <StatsCard
                icon={DateIcon}
                iconColor="green"
                title="data limite para realizacao da tarefa"
                description={MomentComponent(this.state.deadline).format("DD-MM-YYYY")}
                statIcon={DateIcon}
                statText={`${MomentComponent(this.state.deadline).fromNow()}`}
                />}
              <Card className={classes.card}>

              </Card>
            </Grid>
          </Grid>
        <Bottom />
      </div>
    )
  }
}

Task.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Task);
