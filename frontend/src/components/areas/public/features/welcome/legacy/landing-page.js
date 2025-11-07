import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Link
} from '@mui/material'
import peopleImage from 'images/landingPage_People.png'
import logoGrey from 'images/logo-complete-gray.png'
import screenImage from 'images/gitpay-explore-task-screenshot.png'
import profileImage from 'images/avatar-alexandre.png'
import Bottom from 'design-library/organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'
import Clientlist from './clientlist'
import TeamCard from 'design-library/molecules/cards/team-card/team-card'
import ContactRecruiterFormContainer from '../../../../../../containers/contact-recruiter-form'

import deal from 'images/deal.png'

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from '../components/CommonStyles'

// Landing Page for GitPay
// Total hours worked on this: ~12hours
// Still need to add in functionality for buttons
// Export Styles to separate file to clean up code but left here for you to see for now

import headhunterTeamMember1 from 'images/teams/headhunter-team-member1.png'

const recruiterTeam = [
  {
    name: 'Alexandre Magno',
    description: 'Founder of Gitpay, and senior software engineer, sharing and helping developers to face the challenges of technical recruitment.',
  image: headhunterTeamMember1,
    linkedinUrl: 'https://www.linkedin.com/in/alexandremagnoteleszimerer/'
  }
]

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
    height: 50,
    '&:hover': {
      background: '#7F83FF',
    },
  },
  buttonHireSmall: {
    textTransform: 'none',
    background: '#4A4EDD',
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
  justify: {
    textAlign: 'justify',
  },
  bottomImage: {
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    width: '100vw',
    [theme.breakpoints.down('sm')]: {
      bottom: 0,
    }
  },
  header: {
    fontSize: '2.5em',
    fontWeight: 200,
    marginTop: 70,
    marginBottom: 36,
    [theme.breakpoints.down('sm')]: {
      lineHeight: 1.5,
      fontSize: '1.3em',
    }
  },
  paragraph: {
    fontSize: '1.2em',
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
      lineHeight: 1.5,
      fontSize: '1em',
      margin: '0 auto',
      width: 270
    }
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
  const ref = React.createRef()

  const handleClick = (event) => {
    event.preventDefault()
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div>
      <div className={ classes.root }>
        <Grid container className={ classes.center } spacing={ 8 }>
          <Grid size={{ xs: 12 }}>
            <AppBar
              position='static'
              style={ { background: 'transparent', boxShadow: 'none' } }
            >
              <Toolbar>
                <Link href='https://gitpay.me/#/recruitment'>
                  <img src={ logoGrey } alt='logo' className={ classes.logoImage } />
                </Link>
                <div className={ classes.grow } />
                <Button
                  className={ classes.buttonSignin }
                  onClick={ handleClick }
                >
                  <p className={ classes.signText }><FormattedMessage id='welcome.landing.signin' defaultMessage='Contact us' /></p>
                </Button>
                <Button href={ 'https://gitpay.me' } target='_blank' className={ classes.buttonSignup }>
                  <p className={ classes.signText }><FormattedMessage id='welcome.landing.signup' defaultMessage='GitPay.me' /></p>
                </Button>
              </Toolbar>
            </AppBar>
            <Grid size={{ xs: 12 }} className={ classes.textContainer }>
              <h1 className={ classes.header }>
                <FormattedMessage id='welcome.landing.title' defaultMessage='A Better Way to Recruit Technical Talent' />
              </h1>
              <p className={ classes.paragraph }><FormattedMessage id='welcome.landing.description' defaultMessage='GitPay is a platform by developers, for developers that connects global talent to real-world technical challenges on GitHub and Bitbucket. This allows our international recruitment team to identify the best, proven talent in real time for roles at some of the world’s most exciting companies, like yours. Want our help filling a position?' /></p>
            </Grid>
            <Grid size={{ xs: 12 }} className={ classes.margin }>
              <Button
                variant='contained'
                size='medium'
                color='primary'
                className={ classes.buttonHire }
                onClick={ handleClick }
              >
                <p className={ classes.textSize }>                <FormattedMessage id='welcome.landing.hire' defaultMessage='Connect with a Recruiter' /></p>
              </Button>
              <Button
                variant='outlined'
                size='medium'
                color='primary'
                className={ classes.buttonWork }
                style={ { display: 'none' } }
              >
                <p className={ classes.textSize }><FormattedMessage id='welcome.landing.work' defaultMessage='Work' /></p>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Grid size={{ xs: 12 }}>
        <img src={ peopleImage } />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Clientlist />
      </Grid>
      <Section>
        <Grid container spacing={ 3 }>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MainTitle center>
              <Typography variant='h5' gutterBottom>
                <FormattedMessage
                  id='welcome.landing.about.title'
                  defaultMessage='About GitPay'
                />
              </Typography>
            </MainTitle>
            <MainList>
              <Typography align='justify'>
                <FormattedMessage
                  id='welcome.landing.about.description'
                  defaultMessage='GitPay is a new marketplace platform and community of technical talent who work collaboratively to solve issues in GitHub and Bitbucket in exchange for experience and/or bounties. As the future of work becomes reality and distributed, agile teams become the norm, we are poised to support open source and proprietary projects with a ready-to-work community of talent. Visit gitpay.me to learn more.'
                />
              </Typography>
              <div style={ { textAlign: 'center', marginTop: 20, paddingBottom: 40 } }>
                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.buttonHireSmall }
                  href={ 'https://gitpay.me' }
                  target={ '_blank' }
                >
                  <FormattedMessage id='welcome.landing.about.button' defaultMessage='Visit Gitpay' />
                </Button>
              </div>
            </MainList>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResponsiveImage width='600' src={ screenImage } />
          </Grid>
        </Grid>
      </Section>
      <Section alternative className={ classes.bgContrast }>
        <Grid container spacing={ 3 }>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MainTitle center>
              <Typography variant='h5' gutterBottom>
                <FormattedMessage
                  id='welcome.landing.recruitment.title'
                  defaultMessage='GitPay for recruitment'
                />
              </Typography>
            </MainTitle>
            <MainList>
              <Typography align='justify'>
                <FormattedMessage
                  id='welcome.landing.recruitment.description'
                  defaultMessage='We know finding technical talent is competitive and challenging. How? Our co-founders are developers and have worked at major organizations including Dansk Bank and the NeuroLeadership Institute and have solved technical challenges for clients on five continents. We understand the unique requirements of technical recruitment and have built a team of recruiters backed by our platform who are able to identify and help place the best candidate for nearly any technical role. Connect with a recruiter to start a discussion.'
                />
              </Typography>
              <div style={ { textAlign: 'center', marginTop: 20, paddingBottom: 40 } }>
                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.buttonHireSmall }
                  onClick={ handleClick }
                >
                  <FormattedMessage id='welcome.landing.hire' defaultMessage='Connect with a Recruiter' />
                </Button>
              </div>
            </MainList>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResponsiveImage src={ profileImage } />
          </Grid>
        </Grid>
      </Section>
      <Section>
        <Grid container spacing={ 3 }>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MainTitle center>
              <Typography variant='h5' gutterBottom>
                <FormattedMessage
                  id='welcome.landing.issues.title'
                  defaultMessage='GitPay for immediate technical requirements'
                />
              </Typography>
            </MainTitle>
            <MainList>
              <Typography align='justify'>
                <FormattedMessage
                  id='welcome.landing.issues.description'
                  defaultMessage='GitPay is designed to allow project and product managers to immediately access talent for pressing issues. Have a pressing issue you need solved? Visit gitpay.me to add tasks for bounties.'
                />
              </Typography>
              <div style={ { textAlign: 'center', marginTop: 20, paddingBottom: 40 } }>
                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  className={ classes.buttonHireSmall }
                  href={ 'https://gitpay.me' }
                  target={ '_blank' }
                >
                  <FormattedMessage id='welcome.landing.services' defaultMessage='Join Gitpay' />
                </Button>
              </div>
            </MainList>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResponsiveImage width='400' src={ deal } />
          </Grid>
        </Grid>
      </Section>
      <Section>
        <Grid container spacing={ 3 }>
          <Grid size={{ xs: 12 }} justify>
            <TeamCard data={ recruiterTeam } />
          </Grid>
        </Grid>
      </Section>
      <Section>
        <div ref={ ref }>
          <Grid container spacing={ 3 }>
            <Grid size={{ xs: 12 }} justify>
              <ContactRecruiterFormContainer />
            </Grid>
          </Grid>
        </div>
      </Section>
      <Bottom />
    </div>
  )
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default LandingPage
