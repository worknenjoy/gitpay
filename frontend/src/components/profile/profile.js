import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DeviceHubIcon from 'material-ui-icons/DeviceHub';
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

import TopBar from '../topbar/topbar';

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
    width: 140,
    height: 140
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
    marginTop: 20,
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
        picture_url: "Loading picture",
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
      <Grid container className={classes.root} spacing={24} >
        <TopBar />
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="headline" component="h3">
              This is 1 sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your application.
            </Typography>
          </Paper>
          <div className={classes.parentCard}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="https://unsplash.it/g/700/200/?gravity=east"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography variant="headline" component="h2">
                  Lizard
                </Typography>
                <Typography component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="https://unsplash.it/g/700/200/?gravity=east"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography variant="headline" component="h2">
                  Lizard
                </Typography>
                <Typography component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image="https://unsplash.it/g/700/200/?gravity=east"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography variant="headline" component="h2">
                  Lizard
                </Typography>
                <Typography component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
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
                  >AM</Avatar>
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
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Sent mail" />
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Drafts" />
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Inbox" />
                  </MenuItem>
                </MenuList>
              </Paper>
            </div>
          </div>
        </Grid>
      </Grid>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
