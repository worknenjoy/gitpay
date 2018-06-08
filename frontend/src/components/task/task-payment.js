import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import Divider from 'material-ui/Divider';
import ListItemText from 'material-ui/List/ListItemText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Dialog from 'material-ui/Dialog';
import FilterListIcon from 'material-ui-icons/FilterList';
import DoneIcon from 'material-ui-icons/Done';
import blue from 'material-ui/colors/blue';

const logoGithub = require('../../images/github-logo.png');

const statuses = ['open', 'in_progress', 'closed'];

const statusesDisplay = {
  'open': 'Aberta',
  'in_progress': 'Em desenvolvimento',
  'closed': 'Finalizada'
}

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  }
};

class TaskPayment extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, orders, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Pagar pela tarefa como recompensa</DialogTitle>
        <div>
          <List>
            {orders.map((status, index) => (
              <ListItem style={ selectedValue === status ? {background: blue[200]} : {} } button onClick={() => this.handleListItemClick(status)} key={status}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    { selectedValue === status ?
                      (
                        <DoneIcon />
                      ) : (
                        <FilterListIcon />
                      )
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={statusesDisplay[status]} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={() => this.handleListItemClick(this.props.providerStatus)}>
              <ListItemAvatar>
                <Avatar>
                  <img width="24" src={logoGithub} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`Do github: ${statusesDisplay[this.props.providerStatus]}`} />
            </ListItem>
          </List>
        </div>
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
