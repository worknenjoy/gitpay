import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import Divider from 'material-ui/Divider';
import ListItemText from 'material-ui/List/ListItemText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogContentText from 'material-ui/Dialog/DialogContentText';
import Dialog from 'material-ui/Dialog';
import FilterListIcon from 'material-ui-icons/FilterList';
import RedeemIcon from 'material-ui-icons/Redeem';
import blue from 'material-ui/colors/blue';

const logoGithub = require('../../images/github-logo.png');

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  }
};

const statuses =  {
  'open': 'Em aberto',
  'succeeded': 'Paga',
  'fail': 'Falha no pagamento'
}

class TaskPayment extends Component {

  constructor(props) {
    super(props);
    this.payTask = this.payTask.bind(this);
  }

  payTask(e) {
    this.props.onPay(this.props.id);
    this.props.onClose();
  }

  render() {
    const { classes, orders, ...other } = this.props;

    const hasOrders = () => {
      return this.props.orders.length ? true : false;
    }

    const displayTotal = () => {
      if(hasOrders()) {
        let sum = 0;
        this.props.orders.map((item) => {
          if(item.status === 'succeeded') sum += parseInt(item.amount);
        });
        return sum;
      }
    }

    const sendTo = (id) => {
      const chosen = this.props.assigns.filter((item) => {
        return item.userId === id;
      });
      return chosen[0].User.name;
    }

    return (
      <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Pagar pela tarefa como recompensa</DialogTitle>
        <DialogContent>
          {this.props.paid &&
            <Typography type="subheading" color="primary" gutterBottom noWrap>
              {`A transferência para esta tarefa já foi realizada`}
            </Typography>
          }
          <List>
            {orders.map((order, index) => (
              <ListItem key={order.id}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <FilterListIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`$ ${order.amount}`} secondary={`${statuses[order.status] || 'indefinida'}`} />
              </ListItem>
            ))}
          </List>
          <DialogContentText>
            <span style={{display: 'inline-block', margin: 20}}>
              {!this.props.paid ? (
                <div>
                  {this.props.assigned ? `Enviar para ${sendTo(this.props.assigned)}` : 'Ninguém foi escolhido para esta tarefa, então não temos como efetuar o pagamento'}
                </div>
              ) : (
                <div>
                  {`O pagamento foi efetuado para ${sendTo(this.props.assigned)}`}
                </div>
              )}
            </span>
          </DialogContentText>
          <Divider />
          {hasOrders() ?
            (
              <div>
              { !this.props.paid &&
              <Button onClick={this.payTask} style={{float: 'right', margin: 10}} variant="raised" color="primary"
                      disabled={this.props.assigned ? false : true}>
                <RedeemIcon style={{marginRight: 10}}/>
                {`Pagar $ ${displayTotal()}`}
              </Button>
              }
              </div>
            ) : (
              <ListItemText variant="raised" disabled={true}
                            primary={`Não temos nenhum pagamento realizado para esta tarefa`}/>
            )}
          { !this.props.paid ? (
          <Button onClick={this.props.onClose} style={{ float: 'right', margin: 10}} >
            Cancelar
          </Button>) : (
            <Button onClick={this.props.onClose} style={{ float: 'right', margin: 10}} >
              Fechar
            </Button>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

TaskPayment.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(TaskPayment);
