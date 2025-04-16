import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MuiAlert from '@material-ui/lab/Alert'
import { FormattedMessage } from 'react-intl'

import { countryCodes } from './country-codes'

import {
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@material-ui/core'

const styles = theme => ({
  countryContainer: {
    padding: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center'
  },
  countryItem: {
    display: 'inline-block',
    textAlign: 'center',
    padding: 25
  }
})

class CountryPicker extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      currentCountryLabel: null,
      currentCountryCode: null,
      currentCountryImage: null
    }
  }

  handleCountry = (e, item) => {
    this.setState({
      currentCountryCode: item.code,
      currentCountryLabel: item.country,
      currentCountryImage: item.image
    })
  }

  render () {
    const { classes } = this.props

    const Alert = (props) => {
      return <MuiAlert elevation={ 2 } variant='outlined' { ...props } />
    }

    const getCountryButtons = () => {
      return countryCodes.map((item) => {
        const imageModule = require(`images/countries/${item.image}.png`)
        const countryImageSrc = imageModule.default || imageModule
        return (
          <Button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} variant={ this.state.currentCountryCode === item.code ? 'outlined' : '' } onClick={ (e) => this.handleCountry(e, item) } className={ classes.countryItem }>
            <img width='48' style={{marginRight: 10}} src={ countryImageSrc } onLoad={() => {}} />
            <Typography component='span' gutterBottom>
              { item.country }
            </Typography>
          </Button>
        )
      })
    }

    return (
      <div>
        <Dialog
          open={ this.props.open }
          onClose={ (e) => this.props.onClose(e, {
            code: null,
            country: null,
            image: null
          }) }
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          fullWidth
          maxWidth={ 'md' }
        >
          <DialogTitle id='alert-dialog-title'>{ 'Choose your country' }</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <Alert severity='info'>
                <Typography variant='body1'>
                  <FormattedMessage id='countryPicker.info' defaultMessage='If your country is not listed, please contact us at contact@gitpay.me' />
                </Typography>
              </Alert>
            </DialogContentText>
            <div className={ classes.countryContainer }>
              { getCountryButtons() }
            </div>
          </DialogContent>
          <DialogActions alignItems='space-evenly'>
            <DialogContent id='alert-dialog-footer'>
              <DialogContentText>
                Icons made by <a href='http://www.freepik.com/' title='Freepik'>Freepik</a>, <a href="https://www.flaticon.com/free-icons/pakistan" title="pakistan icons">Pakistan icons created by Roundicons - Flaticon</a>,  <a href="https://www.flaticon.com/free-icons/turkey" title="turkey icons">Turkey icons created by IconsBox - Flaticon</a> and <a href="https://www.flaticon.com/free-icons/flags" title="flags icons">Icon.doit - Flaticon</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/' title='Creative Commons BY 3.0' target='_blank' rel="noreferrer">CC 3.0 BY</a>
              </DialogContentText>
            </DialogContent>
            <Button onClick={ (e) => this.props.onClose(e, {
              country: null,
              code: null,
              image: null
            }) } size='large'>
              Cancel
            </Button>
            <Button variant='contained' onClick={ (e) => this.props.onClose(e, {
              country: this.state.currentCountryLabel,
              code: this.state.currentCountryCode,
              image: this.state.currentCountryImage
            }) } size='large' color='secondary' autoFocus style={{
              minWidth: 'auto'
            }}>
              Choose { this.state.currentCountryLabel }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(CountryPicker)
