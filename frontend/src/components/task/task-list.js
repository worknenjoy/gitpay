import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';

import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';

import { withStyles } from 'material-ui/styles';

import RedeemIcon from 'material-ui-icons/Redeem';
import ShoppingBasket from 'material-ui-icons/ShoppingBasket';

import TaskItem from './task-item';

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
  icon: {
    backgroundColor: 'black'
  },
  media: {
    width: 128,
    height: 128,
    marginLeft: 64,
    marginTop: 20
  },
  rootTabs: {
    flexGrow: 1,
    marginBottom: 40,
    backgroundColor: theme.palette.primary.light
  }
});

class TaskList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    }

    this.handleTabChange = this.handleTabChange.bind(this);

  }

  componentDidMount() {
    this.props.listTasks();
  }

  handleTabChange(event, value) {
    this.setState({ tab: value });
    switch (value) {
      case 0:
        this.props.listTasks();
        break;
      case 1:
        this.props.filterTasks(this.props.tasks, 'userId', this.props.user.id);
        break;
      case 2:
        this.props.filterTasks(this.props.tasks, 'Assigns', this.props.user.id);
        break;
      case 3:
        this.props.filterTasks(this.props.tasks, 'assigned', this.props.user.id);
        break;
      default:
        this.props.filterTasks(this.props.tasks);
    }
  };

  render() {

    const { classes } = this.props;

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
          <div className={classes.rootTabs}>
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab value={0} label="Todas tarefas" icon={<RedeemIcon />} />
              <Tab value={1} label="Criadas por mim" icon={<ShoppingBasket />} />
              <Tab value={2} label="Tenho interesse" icon={<ShoppingBasket />} />
              <Tab value={3} label="Atribuidas a mim" icon={<ShoppingBasket />} />
              <Tab value={4} label="Abertas" icon={<ShoppingBasket />} />
            </Tabs>
          </AppBar>
          <TabContainer>
            <List component="nav">
              { this.props.tasks.data.map((item, key) => (
                <TaskItem item={item} key={key} classes={classes} ready={this.props.tasks.completed} />
              ))}
            </List>
          </TabContainer>
          </div>
        </Paper>
      </div>
    )
  }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TaskList));
