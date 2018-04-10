import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Notification from '../notification/notification';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import DeviceHubIcon from 'material-ui-icons/DeviceHub';
import LibraryBooks from 'material-ui-icons/LibraryBooks';
import CreditCard from 'material-ui-icons/CreditCard';
import Tune from 'material-ui-icons/Tune';

import classNames from 'classnames';
import nameInitials from 'name-initials';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

import TopBar from '../topbar/topbar';
import Bottom from '../bottom/bottom';

const logoGithub = require('../../images/github-logo.png');
const logoBitbucket = require('../../images/bitbucket-logo.png');

const taskIcon = require('../../images/task-icon.png');
const paymentIcon = require('../../images/payment-icon.png');
const toolsIcon = require('../../images/tools-icon.png');

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  altButton: {
    marginRight: 10
  },
  paper: {
    padding: 10,
    margin: 10
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

  },
  bigAvatar: {
    width: 80,
    height: 80
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
    width: 128,
    height: 128,
    marginLeft: 64,
    marginTop: 20
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
});

class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: true,
      task: {
        issue: {
          title: "loading"
        }
      }
    }

    this.handleCloseLoginNotification = this.handleCloseLoginNotification.bind(this);
  }

  componentWillMount() {
    axios.get(api.API_URL + `/tasks/fetch/${this.props.params.id}`).then((task) => {
      console.log(task.data);
      this.setState({task: {issue: task.data.metadata.issue}});
    }).catch((e) => {
      console.log('not possible to fetch issue');
      console.log(e);
    });
  }

  handleCloseLoginNotification() {
    this.setState({created: false});
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <Grid container className={classes.root} spacing={24} >
          <TopBar />
          <Typography variant="title" gutterBottom>
            {this.state.task.issue.title}
          </Typography>
          <Notification message="Tarefa incluída com sucesso" open={this.state.created} onClose={this.handleCloseLoginNotification} />
        </Grid>
        <Bottom classes={classes} />
      </div>
    )
  }
}

Task.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Task);
