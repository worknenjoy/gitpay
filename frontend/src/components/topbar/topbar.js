import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import MailIcon from 'material-ui-icons/Mail';
import Notifications from 'material-ui-icons/Notifications';
import HomeIcon from 'material-ui-icons/Home';
import PlusIcon from 'material-ui-icons/Queue';
import Badge from 'material-ui/Badge';
import { withStyles } from 'material-ui/styles';
import api from '../../consts';
import axios from 'axios';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Auth from '../../modules/auth';
import Notification from '../notification/notification';
import nameInitials from 'name-initials';

import mainStyles from '../styles/style';

const classes = (theme) => mainStyles(theme);

const logo = require('../../images/gitpay-logo.png');

const styles = {
  logoMain: {
    marginLeft: 180
  },
  logoAlt: {
    marginLeft: 120
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
    marginRight: 30,
    marginLeft: 30
  },
  intro: {
    padding: 20,
    margin: 0,
    textAlign: 'center',
    height: 40,
    width: '100%',
    backgroundColor: 'black'
  },
  spaceRight: {
    marginRight: 10
  },
  avatar: {
    marginLeft: 40
  }
};

class TopBar extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      anchorEl: null,
      notify: false,
      notifyLogin: false,
      user: {
        name: "Loading name...",
        picture_url: null,
        website: "Loading website",
        repos: "Loading repo info",
        provider: "Loading provider"
      }
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignOut.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleCloseLoginNotification = this.handleCloseLoginNotification.bind(this);
    this.handleProfile = this.handleProfile.bind(this);

  }

  componentDidMount() {
    const token = Auth.getToken();

    if (token) {
      axios.get(api.API_URL + '/authenticated', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          this.setState({user: response.data.user, logged: true, notifyLogin: !Auth.getAuthNotified()});
          Auth.authNotified();
        })
        .catch((error) => {
          console.log(error);
        });
      }
  }

  handleChange(event, checked) {
    this.setState({ auth: checked });
  };

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose() {
    this.setState({ anchorEl: null });
  };

  handleCloseNotification() {
    this.setState({ notify: false });
  }

  handleCloseLoginNotification() {
    this.setState({ notifyLogin: false });
  }

  handleSignIn() {

  }

  handleProfile() {
    window.location.assign("/#/profile");
  }

  handleSignOut() {
    Auth.deauthenticateUser();
    const newState = {logged: false, notify: true}
    this.setState(newState);
    this.context.router.push({pathname: '/', state: {loggedOut: true}});
  }

  render() {
    const isLoggedIn = this.state.logged;
    const anchorEl = this.state.anchorEl;
    const open = Boolean(anchorEl);

    return (
      <div style={styles.intro}>
        <div style={styles.containerBar}>
          <Button href="/">
            <HomeIcon color="primary"/>
          </Button>
            <img style={isLoggedIn ? styles.logoMain : styles.logoAlt } src={logo} width="140"/>
            <div style={styles.notifications}>
              <Button href={`${api.API_URL}/authorize/bitbucket`} variant="raised" size="medium" color="primary" className={classes.altButton}>
                <span style={styles.spaceRight}>Nova Tarefa</span>  <PlusIcon />
              </Button>
              { isLoggedIn &&
              <div style={styles.notifications}>
                <Badge badgeContent={4} color="secondary">
                  <Notifications color="primary"/>
                </Badge>
                {this.state.user.picture_url ?
                  (<Avatar
                    alt={this.state.user.username}
                    src={this.state.user.picture_url}
                    style={styles.avatar}
                    onClick={this.handleMenu}
                  /> ) : (
                    <Avatar
                      alt={this.state.user.username}
                      src=""
                      style={styles.avatar}
                      onClick={this.handleMenu}
                    >{nameInitials(this.state.name)}</Avatar>
                  )}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleProfile}>
                    Sua conta
                  </MenuItem>
                  <MenuItem onClick={this.handleSignOut}>
                    Sair
                  </MenuItem>
                </Menu>
              </div>
              }
              <Notification message="Você agora está logado" open={this.state.notifyLogin} onClose={this.handleCloseLoginNotification} />
              <Notification message="Você saiu saiu da sua conta com sucesso" open={this.state.notify} onClose={this.handleCloseNotification} />
          </div>
        </div>
      </div>
    )
  }
};

TopBar.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default withStyles(styles)(TopBar);
