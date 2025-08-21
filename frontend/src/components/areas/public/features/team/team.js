import React, { useState } from 'react'
import Bottom from '../../../../shared/bottom/bottom'
import TopBarContainer from '../../../../../containers/topbar'
import TeamCard from 'design-library/molecules/cards/team-card/TeamCard'
import { Grid } from '@mui/material'
import { Page } from 'app/styleguide/components/Page'
import { Section } from '../welcome/components/CommonStyles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

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
    name: 'Alexandre Magno',
    description: 'Founder of Gitpay, and senior software engineer for 15+ years, Alexandre is an active open source maintainer, author of Mobile First Boostrap and he help the development community with your blog alexandremagno.net.',
    image: require('images/teams/headhunter-team-member1.png'),
    linkedinUrl: 'https://www.linkedin.com/in/alexandremagnoteleszimerer/',
    githubUrl: 'https://github.com/alexanmtz'
  },
  {
    name: 'Wharley Ornelas',
    description: 'Fullstack developer, with 15+ development experience. First developer to contribute and he helped with the core, and a brazilian developer evangelist',
    image: require('images/teams/wharley-team-member.jpg'),
    linkedinUrl: 'https://in.linkedin.com/in/wharley-ornelas-da-rocha-65420932',
    githubUrl: 'http://github.com/wharley'
  },
  {
    name: 'Mayna Thais',
    description: 'Project leader with 9+ years of experience. She has worked with software projects and IT infrastructure for many companies. Graduated in Information Systems, MBA in Project Management and Scrum Master certified.',
    image: require('images/teams/core-team-mayna.jpg'),
    linkedinUrl: 'https://br.linkedin.com/in/mayna-thais',
    githubUrl: 'https://github.com/mthais'
  },
  {
    name: 'Rafael Quintanilha',
    description: 'Software Developer Intern at Gitpay. Graduated in IT Management and with a master\'s in e-business, Rafael has experience working as a digital project manager and now embraces a new career path as a web developer.',
    image: require('images/teams/profile_rq.jpg'),
    linkedinUrl: 'https://www.linkedin.com/in/rafael-quintanilha/',
    githubUrl: 'https://github.com/RafaelQuintanilha18'
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
          <Grid size={{ xs: 12 }} justify='center'>
            <TeamCard data={ recruiterTeam } />
          </Grid>
        </Grid>
      </Section>
      <Section>
        <Grid container spacing={ 3 } style={ { backgroundColor: 'black' } } justify={ 'center' } alignItems={ 'center' } >
          <Grid size={{ lg: 4, md: 4, sm: 6 }}>
            <img src={ require('images/core-team-page-asset.png').default } alt='assets' />
          </Grid>
          <Grid size={{ lg: 4, md: 5, sm: 6 }}>
            <form onChange={ onChange } onSubmit={ onSubmit } onBlur={ onBlur }>
              <Grid container className={ classes.coreTeamForm }>
                <Grid size={{ xs: 12 }} >
                  <Typography gutterBottom >
                    Join the team!
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }} style={ { color: 'silver' } } >
                  <Typography gutterBottom >
                    Work with the best and be part of the core
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12 }}>
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
