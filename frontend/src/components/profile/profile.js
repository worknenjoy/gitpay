import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
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
    marginRight: 10
  },
  media: {
    height: 200,
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

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "Loading name...",
        picture_url: null,
        website: "Loading website",
        repos: "Loading repo info",
        provider: "Loading provider"
      }
    }
  }

  componentWillMount() {

    const token = Auth.getToken();

    if (token) {
      axios.get(api.API_URL + '/authenticated', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          this.setState({user: response.data.user});
          console.log('state after authorize');
          console.log(this.state);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <Grid container className={classes.root} spacing={24} >
          <TopBar />
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="headline" component="h3">
                Bem vindo ao Gitpay!
              </Typography>
              <Typography component="p">
                Saiba quais são os seus primeiros passos para começar
              </Typography>
            </Paper>
            <div className={classes.parentCard}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image="https://picsum.photos/200/300?image=0"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography variant="headline" component="h2">
                    Tarefas
                  </Typography>
                  <Typography component="p">
                    Veja as tarefas que estão disponíveis para você e comece!
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver tarefas
                  </Button>
                </CardActions>
              </Card>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image="https://picsum.photos/200/300?image=998"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography variant="headline" component="h2">
                    Pagamento
                  </Typography>
                  <Typography component="p">
                    Preencha os dados de pagamento para você receber pelas tarefas integradas
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Configurar pagamento
                  </Button>
                </CardActions>
              </Card>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image="https://picsum.photos/200/300?image=1059"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography variant="headline" component="h2">
                    Preferências
                  </Typography>
                  <Typography component="p">
                    Configure sua conta para ficar de acordo com suas preferências
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Configurar preferências
                  </Button>
                </CardActions>
              </Card>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.bigRow}>
              <div className={classes.row}>
                {this.state.user.picture_url ?
                  (<Avatar
                    alt={this.state.user.username}
                    src={this.state.user.picture_url}
                    className={classNames(classes.avatar, classes.bigAvatar)}
                  /> ) : (
                    <Avatar
                      alt={this.state.user.username}
                      src=""
                      className={classNames(classes.avatar, classes.bigAvatar)}
                    >{nameInitials(this.state.user.name)}</Avatar>
                  )}
              </div>
              <div className={classes.rowList}>
                <div className={classes.rowContent}>
                  <Button disabled={this.state.user.provider == "github"} href={`${api.API_URL}/authorize/github`} variant="raised" size="small" color="secondary" className={classes.altButton}>
                    <img width="16" src={logoGithub} className={classes.icon} /> Github
                  </Button>
                  <Button disabled={this.state.user.provider == "bitbucket"} href={`${api.API_URL}/authorize/bitbucket`} variant="raised" size="small" color="secondary" className={classes.altButton}>
                    <img width="16" src={logoBitbucket} className={classes.icon} /> Bitbucket
                  </Button>
                </div>
              </div>
              <div className={classes.rowList}>
                <div className={classes.infoItem}>
                  <Typography>
                    {this.state.user.name}
                  </Typography>
                </div>
                <div className={classes.infoItem}>
                  <Typography>
                    <a href={this.state.user.website}>
                      {this.state.user.website}
                    </a>
                  </Typography>
                </div>
                <div className={classes.infoItem}>
                  <Typography>
                    <h4>
                      <DeviceHubIcon /> Repositórios
                    </h4>
                    <p>
                      {this.state.user.repos}
                    </p>
                  </Typography>
                </div>
              </div>
              <div className={classes.row}>
                <Paper className={classes.menuContainer}>
                  <MenuList>
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>
                        <LibraryBooks />
                      </ListItemIcon>
                      <ListItemText classes={{ primary: classes.primary }} inset primary="Tarefas" />
                    </MenuItem>
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>
                        <CreditCard />
                      </ListItemIcon>
                      <ListItemText classes={{ primary: classes.primary }} inset primary="Pagamento" />
                    </MenuItem>
                    <MenuItem className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>
                        <Tune />
                      </ListItemIcon>
                      <ListItemText classes={{ primary: classes.primary }} inset primary="Preferências" />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </div>
            </div>
          </Grid>
        </Grid>
        <Bottom classes={classes} />
      </div>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
