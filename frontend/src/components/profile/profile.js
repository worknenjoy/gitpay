import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import TopBar from '../topbar/topbar';

const styles = theme => ({
  root: {
    flexGrow: 1
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
  avatar: {

  },
  bigAvatar: {
    width: 140,
    height: 140
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
  }

  componentWillMount() {
    console.log(this.props);
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
              <Avatar
                alt="Adelle Charles"
                src=""
                className={classNames(classes.avatar, classes.bigAvatar)}
              > AM </Avatar>
            </div>
            <div className={classes.row}>
              <Typography>
                Nome
              </Typography>
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
