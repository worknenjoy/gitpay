import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import MailIcon from 'material-ui-icons/Mail';
import Notifications from 'material-ui-icons/Notifications';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography'
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
import isGithubUrl from 'is-github-url';

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
  },
  formControl: {
    width: '100%'
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
      },
      task: {
        url: {
          error: false,
          value: null
        }
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
    this.handleClickDialogCreateTask = this.handleClickDialogCreateTask.bind(this);
    this.handleClickDialogCreateTaskClose = this.handleClickDialogCreateTaskClose.bind(this);
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.onChange = this.onChange.bind(this);

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

  handleClickDialogCreateTask() {
    this.setState({ createTaskDialog: true });
  }

  handleClickDialogCreateTaskClose() {
    this.setState({ createTaskDialog: false });
  }

  onChange(e) {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const task = this.state.task;
    task[e.target.name].value = e.target.value;
    task[e.target.name].error = false;
    this.setState(task);
  }

  validURL(url) {
    return isGithubUrl(url);
  }

  handleCreateTask(e) {
    const url = this.state.task.url.value;

    if(this.validURL(url)) {
      axios.post(api.API_URL + '/tasks/create', {
        url: this.state.task.url.value,
        provider: 'github'
      })
        .then((response) => {
          console.log('create task response');
          console.log(response);
        })
        .catch((error) => {
          console.log('error to create task');
          console.log(error);
        });
      this.setState({createTaskDialog: false});
    } else {
      this.setState({
        task: {
          url: {
            error: true
          }
        }
      });
    }
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
              <Button onClick={this.handleClickDialogCreateTask} variant="raised" size="medium" color="primary" className={classes.altButton}>
                <span style={styles.spaceRight}>Criar tarefa</span>  <PlusIcon />
              </Button>
              <form onSubmit={this.handleCreateTask} action="POST">
                <Dialog
                  open={this.state.createTaskDialog}
                  onClose={this.handleClickDialogCreateTaskClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Inserir uma nova tarefa</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      <Typography type="subheading" gutterBottom>
                        Para inserir uma nova tarefa, cole a URL de um incidente no <strong>Github</strong> ou <strong>Bitbucket</strong>, dê um valor que ela poderá ser resolvida pela comunidade por um valor estabelecido
                      </Typography>
                    </DialogContentText>
                    <FormControl style={styles.formControl} error={this.state.task.url.error}>
                      <TextField error={this.state.task.url.error}
                        onChange={this.onChange}
                        autoFocus
                        margin="dense"
                        id="url"
                        name="url"
                        label="URL da tarefa"
                        type="url"
                        fullWidth
                      />
                      { this.state.task.url.error &&
                      <FormHelperText error={this.state.task.url.error}>A URL inserida não é válida</FormHelperText>
                      }
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClickDialogCreateTaskClose} color="primary">
                      Cancelar
                    </Button>
                    <Button onClick={this.handleCreateTask} variant="raised" color="secondary" >
                      Inserir
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>

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
