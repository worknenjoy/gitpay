import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import MuiPhoneNumber from 'material-ui-phone-number'
import {
  ContactMailOutlined
} from '@material-ui/icons'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CountryList from './country-list'

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
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  phonePicker: {
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    background: '#4A4EDD',
    height: 50,
    '&:hover': {
      background: '#7F83FF',
    },
  }
}))

export default function ContactRecruiterForm (props) {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const classes = useStyles()
  const { contact } = props

  const validate = (event) => {
    const name = event.nativeEvent.target.name
    const value = event.nativeEvent.target.value
    const required = event.nativeEvent.target.hasAttribute('required')
    if (required) {
      if (name === 'email' && !checkEmail(value)) {
        setFormErrors({ ...formErrors, email: 'invalid email' })
      }
      else
      if (value === '' || value.length < 3) {
        setFormErrors({ ...formErrors, [name]: `invalid ${name}` })
      }
      else {
        setFormErrors({})
      }
    }
  }

  const onChange = (event) => {
    const name = event.nativeEvent.target.name
    const value = event.nativeEvent.target.value
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    validate(event)
    if (Object.keys(formErrors).length === 0) {
      props.contactRecruiters(formData)
    }
  }

  const onBlur = (event) => {
    validate(event)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={ classes.paper }>
        <Avatar className={ classes.avatar }>
          <ContactMailOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Contact us
        </Typography>
        <form className={ classes.form } noValidate onChange={ onChange } onSubmit={ onSubmit } onBlur={ onBlur }>
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                error={ formErrors.name }
                helperText={ formErrors.name }
                autoComplete='name'
                name='name'
                variant='outlined'
                required
                fullWidth
                id='name'
                label='Name'
              />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <TextField
                variant='outlined'
                fullWidth
                id='title'
                label='Title'
                name='title'
                autoComplete='title'
              />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                error={ formErrors.email }
                helperText={ formErrors.email }
                variant='outlined'
                required
                fullWidth
                type='email'
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={ 12 }>
              <Grid container spacing={ 2 } alignItems='center'>
                <Grid item xs={ 2 }>
                  Phone:
                </Grid>
                <Grid item xs={ 10 }>
                  <MuiPhoneNumber
                    name={ 'phone' }
                    defaultCountry={ 'us' }
                    inputClass={ classes.phonePicker }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                error={ formErrors.company }
                helperText={ formErrors.company }
                variant='outlined'
                required
                fullWidth
                name='company'
                label='Company'
                type='text'
                id='company'
              />
            </Grid>
            <Grid item xs={ 12 }>
              <CountryList />
            </Grid>
            <Grid item xs={ 12 }>
              <TextField
                error={ formErrors.message }
                helperText={ formErrors.message }
                variant='outlined'
                rows={ 4 }
                multiline
                required
                fullWidth
                name='message'
                label='Message'
                type='text'
                id='message'
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={ !contact.completed }
            className={ classes.submit }
          >
            { contact.completed ? (
              <span>Contact us</span>
            ) : (
              <CircularProgress color='primary' />
            ) }
          </Button>
          <Button onClick={ () => window.scroll({ top: 0, behavior: 'smooth' }) } variant='text' size='small'>
            back to top
          </Button>
        </form>
      </div>
    </Container>
  )
}
