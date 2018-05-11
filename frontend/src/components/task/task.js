import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Notification from '../notification/notification';
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import RedeemIcon from 'material-ui-icons/Redeem';
import FavoriteIcon from 'material-ui-icons/Favorite';
import PersonPinIcon from 'material-ui-icons/PersonPin';
import HelpIcon from 'material-ui-icons/Help';
import ShoppingBasket from 'material-ui-icons/ShoppingBasket';
import ThumbDown from 'material-ui-icons/ThumbDown';
import ThumbUp from 'material-ui-icons/ThumbUp';
import AddIcon from 'material-ui-icons/Add';
import TrophyIcon from 'material-ui-icons/AccountBalanceWallet';
import CalendarIcon from 'material-ui-icons/PermContactCalendar';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Chip from 'material-ui/Chip';
import PaymentDialog from '../payment/payment-dialog';
import '../checkout/checkout-form';

import StatsCard from '../Cards/StatsCard';
import RegularCard from '../Cards/RegularCard';
import Table from '../Table/Table';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

import marked from 'marked';
import renderHTML from 'react-render-html';

import TopBar from '../topbar/topbar';
import Bottom from '../bottom/bottom';

const paymentIcon = require('../../images/payment-icon-alt.png');

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
    marginRight: 10
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
  card: {
    maxWidth: 280,
    marginRight: 10,
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
      final_price: 0,
      current_price: 0,
      order_price: 0,
      active_tab: 0,
      notification: {
        open: false,
        message: "loading"
      }
    }

    this.handleCloseLoginNotification = this.handleCloseLoginNotification.bind(this);
    this.handlePaymentDialogClose = this.handlePaymentDialogClose.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
  }

  componentWillMount() {
    axios.get(api.API_URL + `/tasks/fetch/${this.props.params.id}`).then((task) => {
      this.setState({task: {issue: task.data.metadata.issue, url: task.data.url, orders: task.data.orders}, final_price: task.data.value, order_price: task.data.value});
    }).catch((e) => {
      console.log('not possible to fetch issue');
      console.log(e);
    });
    if(this.props.route.path == "/task/:id/orders") {
      this.setState({active_tab: 1});
    }
  }

  componentWillReceiveProps(newProp) {
    if(newProp.route.path == "/task/:id/orders") {
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

  pickTaskPrice(price) {
    this.setState({current_price: price, final_price: parseInt(price) + parseInt(this.state.order_price)});
  }

  handleClose() {
    this.setState({payment: {dialog: false}});
  }

  handleInputChange(e) {
    this.setState({current_price: e.target.value});
  }

  handleTabChange(event, tab) {
    this.setState({ active_tab: tab });
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

    const displayOrders = (orders) => {
      return orders.map((item,i) => [`${item.id}`, item.status, `${item.amount}`, item.currency])
    }

    return (
      <div>
        <Grid container className={classes.rootTopBar} spacing={24} >
          <TopBar />
          <Grid item xs={12}>
            <Typography variant="display1" color="primary" align="left" className={classes.typo} gutterBottom>
              <a className={classes.white} href={this.state.task.url}>{this.state.task.issue.title}</a>
            </Typography>
          </Grid>
          <Notification message="Tarefa incluída com sucesso" open={this.state.created} onClose={this.handleCloseLoginNotification} />
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
              <Button size="medium" color="primary" className={classes.altButton}>
                <span className={classes.spaceRight}>Convidar freelancer</span>  <AddIcon />
              </Button>
            </div>
            <div className={classes.paper}>
              <Button size="medium" color="primary" className={classes.altButton}>
                <span className={classes.spaceRight}>Tenho interesse nesta tarefa!</span>  <AddIcon />
              </Button>
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
                          <Chip
                            label=" R$ 500"
                            className={classes.chip}
                            onClick={() => this.pickTaskPrice(500)}
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
                          task={this.props.params.id}
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
                      tableHead={["ID", "Status", "Valor", "Moeda"]}
                      tableData={displayOrders(this.state.task.orders)}
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
                statText={`Último valor recebido de R$ ${this.state.task.orders.map((item,i) => `${item.amount}`)}`}
              />
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
