import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import MailIcon from 'material-ui-icons/Mail';
import Notifications from 'material-ui-icons/Notifications';
import HomeIcon from 'material-ui-icons/Home';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import api from '../../consts';

const logo = require('../../images/gitpay-logo.png');

const styles = {
  img: {
    marginLeft: 40
  },
  containerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifications: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30
  },
  intro: {
    padding: 20,
    margin: 0,
    textAlign: 'center',
    height: 40,
    width: '100%',
    backgroundColor: 'black'
  },
  avatar: {
    marginLeft: 40
  }
};

class TopBar extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      logged: false
    };
  }

  componentDidMount() {
    fetch(api.API_URL + '/authenticated').then(res => {
      return res.json();
    }).then(body => {
      console.log(body);
      if(body.authenticated) {
        this.setState({
          logged: true
        })
      }
    }).catch(e => {
      console.log('error');
      console.log(e);
    });
  }

  render() {
    return (
      <div style={styles.intro}>
        <div style={styles.containerBar}>
          <Button href="/">
            <HomeIcon color="primary"/>
          </Button>
          <img style={styles.img} src={logo} width="140"/>
          <div style={styles.notifications}>
            <Badge badgeContent={4} color="secondary">
              <Notifications color="primary"/>
            </Badge>
            <Avatar style={styles.avatar}>AM</Avatar>
          </div>
        </div>
      </div>
    )
  }
};

export default withStyles(styles)(TopBar);
