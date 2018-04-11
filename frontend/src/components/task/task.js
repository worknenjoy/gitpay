import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Notification from '../notification/notification';
import Avatar from 'material-ui/Avatar';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import AddIcon from 'material-ui-icons/Add';


import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import api from '../../consts';
import axios from 'axios';
import Auth from '../../modules/auth';

import marked from 'marked';
import renderHTML from 'react-render-html';

import TopBar from '../topbar/topbar';
import Bottom from '../bottom/bottom';

const logoGithub = require('../../images/github-logo.png');
const logoBitbucket = require('../../images/bitbucket-logo.png');

const taskIcon = require('../../images/task-icon.png');
const paymentIcon = require('../../images/payment-icon.png');
const toolsIcon = require('../../images/tools-icon.png');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'black',
    height: 180,
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 40,
    height: 40,
  },
  paper: {
    padding: 10,
    margin: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  typo: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: -30,
    paddingTop: 10,
    paddingBottom: 10,
    borderTop: '1px solid #999'
  },
  gridBlock: {
    paddingLeft: 20,
    paddingRight: 20
  },
  spaceRight: {
    marginRight: 10
  },
  altButton: {
    margin: 0,
    border: `1px dashed ${theme.palette.primary.main}`
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
    width: 40,
    height: 40,
    border: `4px solid ${theme.palette.primary.main}`
  },
  bigAvatar: {
    width: 180,
    height: 180
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
    width: 60,
    height: 60,
    marginLeft: 0,
    marginTop: 0
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
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  }
});

class Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: true,
      task: {
        issue: {
          title: "loading",
          body: "loading",
          user: {
            avatar_url: 'loading',
            name: 'loading'
          }
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
          <Grid item xs={12}>
            <Typography variant="display1" color="primary" align="left" className={classes.typo} gutterBottom>
              {this.state.task.issue.title}
            </Typography>
          </Grid>
          <Notification message="Tarefa incluída com sucesso" open={this.state.created} onClose={this.handleCloseLoginNotification} />
        </Grid>
        <Grid container spacing={24} className={classes.gridBlock}>
          <Grid item xs={4} direction="row" justify="flex-start" alignItems="center" style={{display: 'flex', marginTop: 12}}>
            <div>
              <Avatar
                alt={this.state.task.issue.user.name}
                src={this.state.task.issue.user.avatar_url}
                className={classNames(classes.avatar)}
              />
            </div>
            <div className={classes.paper}>
              <Button size="medium" color="primary" className={classes.altButton}>
                <span className={classes.spaceRight}>Convidar freelancer</span>  <AddIcon />
              </Button>
            </div>
          </Grid>
          <Grid item xs={8}>

          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.gridBlock}>
          <Grid item xs={12}>
            <Grid item xs={8}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cover}
                  image="/static/images/cards/live-from-space.jpg"
                  title="Live from space album cover"
                />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography variant="headline">Live From Space</Typography>
                    <Typography variant="subheading" color="textSecondary">
                      Mac Miller
                    </Typography>
                  </CardContent>
                  <div className={classes.controls}>

                  </div>
                </div>
              </Card>
              <Card className={classes.paper}>
                <Typography variant="title" align="left" gutterBottom>
                  Descrição
                </Typography>
                <Typography variant="body2" align="left" gutterBottom>
                  <div>
                    {renderHTML(marked(this.state.task.issue.body))}
                  </div>
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>

            </Grid>
          </Grid>
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
