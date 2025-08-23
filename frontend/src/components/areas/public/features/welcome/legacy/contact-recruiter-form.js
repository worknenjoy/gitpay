import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { MuiTelInput } from 'mui-tel-input'
import {
  ContactMailOutlined
} from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
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

const Wrapper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}))

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  textTransform: 'none',
  background: '#4A4EDD',
  height: 50,
  '&:hover': {
    background: '#7F83FF',
  },
}))

export default function ContactRecruiterForm (props) {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
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
      <Wrapper>
        <StyledAvatar>
          <ContactMailOutlined />
        </StyledAvatar>
        <Typography component='h1' variant='h5'>
          Contact us
        </Typography>
        <StyledForm noValidate onChange={ onChange } onSubmit={ onSubmit } onBlur={ onBlur }>
          <Grid container spacing={ 2 }>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                error={ !!formErrors.name }
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                variant='outlined'
                fullWidth
                id='title'
                label='Title'
                name='title'
                autoComplete='title'
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={ !!formErrors.email }
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
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={ 2 } alignItems='center'>
                <Grid size={{ xs: 2 }}>
                  Phone:
                </Grid>
                <Grid size={{ xs: 10 }}>
                  <MuiTelInput
                label='Phone'
                defaultCountry='US'     // mesmo padrão que você usava
                value={phone}
                onChange={handlePhoneChange}
                fullWidth
                variant='outlined'
                error={ !!formErrors.phone }
                helperText={ formErrors.phone }
              />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={ !!formErrors.company }
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
            <Grid size={{ xs: 12 }}>
              <CountryList />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={ !!formErrors.message }
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
          <SubmitButton
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={ !contact.completed }
          >
            { contact.completed ? (
              <span>Contact us</span>
            ) : (
              <CircularProgress color='primary' />
            ) }
          </SubmitButton>
          <Button onClick={ () => window.scroll({ top: 0, behavior: 'smooth' }) } variant='text' size='small'>
            back to top
          </Button>
        </StyledForm>
      </Wrapper>
    </Container>
  )
}
