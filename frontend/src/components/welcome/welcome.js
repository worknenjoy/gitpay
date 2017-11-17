import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const logo = require('../../images/gitpay-logo.png');

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
  },
  img: {
    marginTop: -18
  },
  button: {
    margin: theme.spacing.unit*2,
    display: 'none'
  },
  mainBlock: {
    textAlign: 'center',
    padding: 10,
    color: theme.palette.text.primary
  },
  intro: {
    padding: 20,
    margin: 0,
    textAlign: 'center',
    height: 55,
    backgroundColor: 'black',
    color: theme.palette.text.secondary,
  }
});

function Welcome(props) {

  const { classes } = props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div className={classes.intro}>
              <img className={classes.img} src={logo} width="230" />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.mainBlock}>
              <Typography type="display2" gutterBottom>
                All the issues solved
              </Typography>
              <Typography type="title" gutterBottom>
                and ideas come to life
              </Typography>
              <Typography gutterBottom noWrap>
                {`
                    Use git to work in different projects and or definition of done is pull requests approved
                `}
              </Typography>
              <Button raised color="primary" className={classes.button}>
                Start to work now
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    );
}

export default withStyles(styles)(Welcome);


