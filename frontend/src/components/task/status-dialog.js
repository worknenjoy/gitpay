import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import ListItemText from 'material-ui/List/ListItemText';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Dialog from 'material-ui/Dialog';
import FilterListIcon from 'material-ui-icons/FilterList';
import AddIcon from 'material-ui-icons/Add';
import DoneIcon from 'material-ui-icons/Done';
import blue from 'material-ui/colors/blue';

const statuses = ['open', 'in_progress', 'closed'];
const statusesDisplay = ['Aberta', 'Em desenvolvimento', 'Finalizada'];

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  }
};

class StatusDialog extends Component {

  constructor(props) {
    super(props);
  }

  handleListItemClick(status) {
    this.props.onSelect({id: this.props.id, status: status});
    this.props.onClose();
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.props.onClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Status da tarefa</DialogTitle>
        <div>
          <List>
            {statuses.map((status, index) => (
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
                <ListItemText primary={statusesDisplay[index]} />
              </ListItem>
            ))}
            <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Obter do Github" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

StatusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(StatusDialog);
