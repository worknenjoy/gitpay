import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

import api from '../../consts';
import axios from 'axios';
import { withStyles } from 'material-ui/styles';

import RedeemIcon from 'material-ui-icons/Redeem';
import ShoppingBasket from 'material-ui-icons/ShoppingBasket';

const styles = theme => ({
  paper: {
    paddingLeft: 20,
    marginLeft: 20
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
    width: 128,
    height: 128,
    marginLeft: 64,
    marginTop: 20
  }
});

class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: []
    }

    this.handleTabChange = this.handleTabChange.bind(this);

  }

  componentDidMount() {

    axios.get(api.API_URL + '/tasks/list')
      .then((response) => {
        this.setState({tasks: response.data});
      })
      .catch((error) => {
        console.log(error);
      });

  }

  handleTabChange() {

  }

  handleClickListItem(id) {
    this.props.history.replace('/task/' + id);
  }

  render() {

    const { classes } = this.props;

    console.log('task list', this.props);

    const TabContainer = (props) => {
      return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
          {props.children}
        </Typography>
      );
    }

    return(
      <div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="headline" component="h3">
            Lista de tarefas
          </Typography>
          <Typography component="p" style={{marginBottom: 40}}>
            Tarefas disponíveis para desenvolvimento
          </Typography>
          <AppBar position="static" color="default">
            <Tabs
              value={0}
              onChange={this.handleTabChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Todas tarefas" icon={<RedeemIcon />} />
              <Tab label="Minhas tarefas" icon={<ShoppingBasket />} />
            </Tabs>
          </AppBar>
          <TabContainer>
            <List component="nav">
              { this.state.tasks.map((item, key) => (
              <ListItem
                key={key}
                button
                onClick={() => this.handleClickListItem(item.id)}
              >
                <ListItemText id={item.id}
                  primary={item.url}
                  secondary={`R$ ${item.value}`}
                />
              </ListItem>
              ))}
            </List>
          </TabContainer>
        </Paper>
      </div>
    )
  }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TaskList));
