import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import { withRouter } from "react-router-dom";
import ReactPlaceholder from 'react-placeholder';
import { RoundShape } from 'react-placeholder/lib/placeholders';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Tooltip from 'material-ui/Tooltip'
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography'
import HomeIcon from 'material-ui-icons/Home';
import PlusIcon from 'material-ui-icons/Queue';
import UserIcon from 'material-ui-icons/AccountCircle';
import MoreIcon from 'material-ui-icons/MoreHoriz';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import nameInitials from 'name-initials';
import isGithubUrl from 'is-github-url';

import { addNotification } from '../../actions/actions'

import mainStyles from '../styles/style';

const classes = (theme) => mainStyles(theme);

const logo = require('../../images/gitpay-logo.png');
const logoGithub = require('../../images/github-logo.png');
const logoBitbucket = require('../../images/bitbucket-logo.png');

const styles = {
  logoMain: {
    marginLeft: 340
  },
  logoAlt: {
    marginLeft: 240
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
    marginLeft: 0
  },
  intro: {
    paddingTop: 20,
    paddingBottom: 10,
    margin: 0,
    textAlign: 'center',
    width: '100%',
    backgroundColor: 'black'
  },
  spaceRight: {
    marginRight: 10
  },
  avatar: {
    marginLeft: 20
  },
  formControl: {
    width: '100%'
  }
};

class TopBar extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      task: {
        url: {
          error: false,
          value: null
        }
      },
      createTaskDialog: false,
      signUserDialog: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleClickDialogCreateTask = this.handleClickDialogCreateTask.bind(this);
    this.handleClickDialogCreateTaskClose = this.handleClickDialogCreateTaskClose.bind(this);
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClickDialogSignUser = this.handleClickDialogSignUser.bind(this);
    this.handleSignUserDialogClose = this.handleSignUserDialogClose.bind(this);
    this.handleGithubLink = this.handleGithubLink.bind(this);

  }

  componentDidMount() {
    this.props.isLogged();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.props.isLogged();
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

  handleClickDialogCreateTask() {
    this.setState({ createTaskDialog: true });
  }

  handleClickDialogCreateTaskClose() {
    this.setState({ createTaskDialog: false });
  }

  handleClickDialogSignUser(e) {
    this.setState(({signUserDialog: true}));
  }

  handleGithubLink() {
    window.location.href = 'https://github.com/worknenjoy/gitpay'
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
      this.props.createTask({
        url: this.state.task.url.value,
        provider: 'github',
        userId: this.props.user ? this.props.user.id : null
      }, this.props.history);
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

  handleSignUserDialogClose() {
    this.setState({signUserDialog: false});
  }

  handleProfile() {
    window.location.assign("/#/profile");
  }

  handleSignOut() {
    this.props.history.replace({pathname: '/'});
    this.props.signOut();
  }

  render() {
    const { task, completed, user } = this.props;
    const isLoggedIn = this.props.logged;
    const anchorEl = this.state.anchorEl;
    const open = Boolean(anchorEl);

    const avatarPlaceholder = (
      <div className='avatar-placeholder'>
        <RoundShape color='#ccc' style={{width: 40, height: 40, margin: 10}}/>
      </div>
    );

    return (

      <div style={styles.intro}>
        <div style={styles.containerBar}>
          <Button href="/">
            <HomeIcon color="primary"/>
          </Button>
            <img style={isLoggedIn ? styles.logoMain : styles.logoAlt } src={logo} width="140"/>
            <div style={styles.notifications}>
              <Button style={{marginRight: 10}} onClick={this.handleClickDialogCreateTask} variant="raised" size="medium" color="primary" className={classes.altButton}>
                <span style={styles.spaceRight}>Criar tarefa</span>  <PlusIcon />
              </Button>
              {!isLoggedIn ?
                (
                <div>
                  <Button style={{fontSize: 12}} onClick={this.handleClickDialogSignUser} variant="raised" size="small" color="secondary"
                          className={classes.altButton}>
                    <span style={styles.spaceRight}> Entrar</span> <UserIcon />
                  </Button>
                  <Dialog
                    open={this.state.signUserDialog}
                    onClose={this.handleSignUserDialogClose}
                    aria-labelledby="form-dialog-title"
                    >
                    <DialogTitle id="form-dialog-title">Entre para a comunidade do Gitpay</DialogTitle>
                    <DialogContent>
                      <div className={classes.mainBlock}>
                        <Typography type="subheading" gutterBottom noWrap>
                          Conecte com algumas dessas contas
                        </Typography>
                        <Button style={{marginRight: 10}} href={`${api.API_URL}/authorize/github`} variant="raised" size="large" color="secondary" className={classes.altButton}>
                          <img style={{marginRight: 5}} width="16" src={logoGithub} /> Github
                        </Button>
                        <Button href={`${api.API_URL}/authorize/bitbucket`} variant="raised" size="large" color="secondary" className={classes.altButton}>
                          <img style={{marginRight: 5}} width="16" src={logoBitbucket} /> Bitbucket
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                ) : (
                  <Button style={{fontSize: 12}} onClick={this.handleProfile} variant="raised" size="small" color="secondary"
                          className={classes.altButton}>
                    <span style={styles.spaceRight}> Conta </span>
                    <Avatar
                      alt={user.username}
                      src={user.picture_url}
                      style={{width: 28, height: 28}}
                      onClick={this.handleMenu}
                    />
                  </Button>
                )
              }
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
                        Para inserir uma nova tarefa, cole a URL de um incidente do <strong>Github</strong>
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
                    <Button disabled={!completed} onClick={this.handleCreateTask} variant="raised" color="secondary" >
                      Inserir
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
              <ReactPlaceholder showLoadingAnimation={true} customPlaceholder={avatarPlaceholder} ready={completed}>
              { isLoggedIn &&
              <div style={styles.notifications}>
                {user.picture_url ?
                  (
                    <div style={{display: 'flex'}}>
                      <Tooltip id="tooltip-github" title="Acessar nosso github" placement="bottom">
                        <Avatar
                        alt={user.username}
                        src={logoGithub}
                        style={styles.avatar}
                        onClick={this.handleGithubLink}
                        />
                      </Tooltip>
                      <Avatar
                      alt={user.username}
                      style={styles.avatar}
                      onClick={this.handleMenu}
                      >
                        <MoreIcon color="action" />
                      </Avatar>
                    </div>
                  ) : (
                    <Avatar
                      alt={user.username}
                      src=""
                      style={styles.avatar}
                      onClick={this.handleMenu}
                    >{nameInitials(user.username)}</Avatar>
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
              </ReactPlaceholder>
          </div>
        </div>
      </div>
    )
  }
};

export default withRouter(withStyles(styles)(TopBar));

/* notification badge

<Badge badgeContent={4} color="secondary">
  <NotificationIcon color="primary"/>
</Badge>
*/
