import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import peopleImage from '../../images/landingPage_People.png'
import logoGrey from '../../images/logo-complete-gray.png'
import Grid from '@material-ui/core/Grid'

// Landing Page for GitPay
// Total hours worked on this: ~12hours
// Still need to add in functionality for buttons
// Export Styles to seperate file to clean up code but left here for you to see for now

const styles = (theme) => ({
  signText: {
    fontWeight: 400,
    marginTop: 0,
    marginBottom: 3,
    fontSize: '1.25em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1em',
    },
  },
  buttonSignin: {
    textTransform: 'none',
    width: 120,
    borderRadius: 25,
    marginRight: 20,
    '&:hover': {
      color: 'white',
      background: '#7F83FF',
    },
    [theme.breakpoints.down('sm')]: {
      width: 90,
    },
  },
  buttonSignup: {
    borderRadius: 25,
    width: 130,
    background: '#7F83FF',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      background: '#4A4EDD',
    },
    [theme.breakpoints.down('sm')]: {
      width: 90,
    },
  },
  buttonHire: {
    textTransform: 'none',
    background: '#4A4EDD',
    marginRight: 20,
    width: 150,
    height: 50,
    '&:hover': {
      background: '#7F83FF',
    },
  },
  buttonWork: {
    border: '2px solid',
    textTransform: 'none',
    color: '#4A4EDD',
    borderColor: '#4A4EDD',
    marginRight: 20,
    width: 150,
    height: 50,
    '&:hover': {
      background: '#7F83FF',
      border: '2px solid',
      color: 'white',
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  root: {
    flexGrow: 1,
    marginLeft: 50,
    marginRight: 70,
    marginTop: 50,
    fontFamily: 'Arial',
    fontWeight: '300',
    color: '#2F2D2D',
    lineHeight: '1.5em',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      margin: 'auto',
    },
  },
  grow: {
    flexGrow: 1,
  },
  logoImage: {
    width: 170,
    [theme.breakpoints.down('sm')]: {
      width: 120,
    },
  },
  topBarContainer: {
    marginTop: 40,
    marginLeft: 70,
    marginRight: 70,
  },
  textContainer: {
    marginTop: 60,
    marginLeft: 30,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 10,
      marginRight: 10
    },
  },
  textSize: {
    fontSize: '1.5em',
    marginTop: 0,
    marginBottom: 0,
  },
  center: {
    textAlign: 'center',
  },
  bottomImage: {
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    width: '100vw',
    [theme.breakpoints.down('sm')]: {
      bottom: 0,
    },
  },
  header: {
    fontSize: '2.5em',
    fontWeight: 200,
    marginTop: 70,
    marginBottom: 36,
    [theme.breakpoints.down('sm')]: {
      lineHeight: 1.5,
      fontSize: '1.3em',
    },
  },
  paragraph: {
    fontSize: '1.45em',
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
      lineHeight: 1.5,
      fontSize: '1em',
      margin: '0 auto',
      width: 270
    },
  },
  margin: {
    marginTop: 60,
    marginBottom: 100,
    marginLeft: 30,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
})

function LandingPage (props) {
  const { classes } = props

  return (
    <div>
      <div className={ classes.root }>
        <Grid container className={ classes.center } spacing={ 8 }>
          <Grid item xs={ 12 }>
            <AppBar
              position='static'
              style={ { background: 'transparent', boxShadow: 'none' } }
            >
              <Toolbar>
                <img src={ logoGrey } alt='logo' className={ classes.logoImage } />
                <div className={ classes.grow } />
                <Button className={ classes.buttonSignin }>
                  <p className={ classes.signText }><FormattedMessage id='welcome.landing.signin' defaultMessage='Sign In' /></p>
                </Button>
                <Button className={ classes.buttonSignup }>
                  <p className={ classes.signText }><FormattedMessage id='welcome.landing.signup' defaultMessage='Sign Up' /></p>
                </Button>
              </Toolbar>
            </AppBar>
            <Grid item xs={ 12 } className={ classes.textContainer }>
              <h1 className={ classes.header }>
                <FormattedMessage id='welcome.landing.title' defaultMessage='We can find the right candidate for you ' />
              </h1>
              <p className={ classes.paragraph }><FormattedMessage id='welcome.landing.description' defaultMessage='Filium morte multavit si sine dubio praeclara sunt, explicabo nemo ' /></p>
              <p className={ classes.paragraph }><FormattedMessage id='welcome.landing.description2' defaultMessage='enim ad minima. Probabo, inquit, modo ista sis aequitate, quam ob ' /></p>
            </Grid>
            <Grid item xs={ 12 } className={ classes.margin }>
              <Button
                variant='contained'
                size='medium'
                color='primary'
                className={ classes.buttonHire }
              >
                <p className={ classes.textSize }>                <FormattedMessage id='welcome.landing.hire' defaultMessage='Hire' /></p>
              </Button>
              <Button
                variant='outlined'
                size='medium'
                color='primary'
                className={ classes.buttonWork }
              >
                <p className={ classes.textSize }><FormattedMessage id='welcome.landing.work' defaultMessage='Work' /></p>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Grid item xs={ 12 }>
        <img src={ peopleImage } className={ classes.bottomImage } />
      </Grid>
    </div>
  )
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LandingPage)
