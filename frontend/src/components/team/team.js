import React, { useState } from 'react'
import Bottom from '../bottom/bottom'
import TopBarContainer from '../../containers/topbar'
import TeamCard from '../Cards/TeamCard'
import { Grid } from '@material-ui/core'
import { Page } from 'app/styleguide/components/Page'
import { Section } from '../welcome/components/CommonStyles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

function checkEmail (emailAddress) {
  let sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
  let sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
  let sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
  let sQuotedPair = '\\x5c[\\x00-\\x7f]'
  let sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
  let sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
  let sDomainRef = sAtom
  let sSubDomain = '(' + sDomainRef + '|' + sDomainLiteral + ')'
  let sWord = '(' + sAtom + '|' + sQuotedString + ')'
  let sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
  let sLocalPart = sWord + '(\\x2e' + sWord + ')*'
  let sAddrSpec = sLocalPart + '\\x40' + sDomain // complete RFC822 email address spec
  let sValidEmail = '^' + sAddrSpec + '$' // as whole string

  let reValidEmail = new RegExp(sValidEmail)

  return reValidEmail.test(emailAddress)
}

const useStyles = makeStyles((theme) => ({
  coreTeamForm: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    color: 'white'
  },
  underline: {
    '&:before': {
      borderBottomColor: '#009688',
    },
    color: 'white',
    marginBottom: 10
  }
}))

const recruiterTeam = [
  {
    name: 'ALEXANDRE',
    description: 'Software Developer',
    image: require('../../images/teams/headhunter-team-member2.png'),
    linkedinUrl: '#',
    githubUrl: '#'
  },
  {
    name: 'WHARLEY',
    description: 'Software Developer',
    image: require('../../images/teams/headhunter-team-member2.png'),
    linkedinUrl: '#',
    githubUrl: '#'
  },
  {
    name: 'MAYNA',
    description: 'Software Developer.',
    image: require('../../images/teams/headhunter-team-member2.png'),
    linkedinUrl: '#',
    githubUrl: '#'
  },
  {
    name: 'CARLS',
    description: 'Software Developer',
    image: require('../../images/teams/headhunter-team-member2.png'),
    linkedinUrl: '#',
    githubUrl: '#'
  }
]

export default function Team (props) {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const classes = useStyles()

  const onChange = (event) => {
    const name = event.nativeEvent.target.name
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (Object.keys(formErrors).length === 0) {
      props.joinTeamAPICall(formData.email)
    }
  }

  const onBlur = (event) => {
    !checkEmail(formData.email) ? setFormErrors({ ...formErrors, email: true }) : setFormErrors({})
  }

  return (
    <Page>
      <TopBarContainer />
      <Section>
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } justify='center'>
            <TeamCard data={ recruiterTeam } />
          </Grid>
        </Grid>
      </Section>
      <Section>
        <Grid container spacing={ 3 } style={ { backgroundColor: 'black' } } justify={ 'center' } alignItems={ 'center' } >
          <Grid item lg={ 4 } md={ 4 } sm={ 6 } sx={ 12 }>
            <img src={ require('../../images/coreTeamPageAsset.png') } alt='assets' />
          </Grid>
          <Grid item lg={ 4 } md={ 5 } sm={ 6 } sx={ 12 } >
            <form onChange={ onChange } onSubmit={ onSubmit } onBlur={ onBlur }>
              <Grid container className={ classes.coreTeamForm }>
                <Grid item xs={ 12 } >
                  <Typography gutterBottom >
                    Join the team!
                  </Typography>
                </Grid>
                <Grid item xs={ 12 } style={ { color: 'silver' } } >
                  <Typography gutterBottom >
                    Work with the best and be part of the core
                  </Typography>
                </Grid>
                <Grid item xs={ 12 }>
                  <TextField
                    required
                    value={ formData.email }
                    error={ formErrors.email }
                    id='email'
                    fullWidth
                    label='Email Address'
                    name='email'
                    color='primary'
                    autoComplete='email'
                    InputProps={ { classes: { underline: classes.underline } } }
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <Button color='primary' fullWidth='true' variant='contained' type='submit'>
                    <Typography gutterBottom >
                      JOIN NOW!
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Section>
      <Bottom />
    </Page>
  )
}
