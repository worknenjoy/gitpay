import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

const countryCodes = [
  { country: 'Australia', code: 'AU', image: 'australia' },
  { country: 'Austria', code: 'AT', image: 'austria' },
  { country: 'Belgium', code: 'BE', image: 'belgium' },
  { country: 'Brazil ', code: 'BR', image: 'brazil' },
  { country: 'Canada', code: 'CA', image: 'canada' },
  { country: 'Denmark', code: 'DK', image: 'denmark' },
  { country: 'Finland', code: 'FI', image: 'finland' },
  { country: 'France', code: 'FR', image: 'france' },
  { country: 'Germany', code: 'DE', image: 'germany' },
  { country: 'Hong Kong', code: 'HK', image: 'hong-kong' },
  { country: 'Ireland', code: 'IE', image: 'ireland' },
  { country: 'Japan', code: 'JP', image: 'japan' },
  { country: 'Luxembourg', code: 'LU', image: 'luxembourg' },
  { country: 'Mexico ', code: 'MX', image: 'mexico' },
  { country: 'Netherlands', code: 'NL', image: 'netherlands' },
  { country: 'New Zealand', code: 'NZ', image: 'new-zealand' },
  { country: 'Norway', code: 'NO', image: 'norway' },
  { country: 'Singapore', code: 'SG', image: 'singapore' },
  { country: 'Spain', code: 'ES', image: 'spain' },
  { country: 'Sweden', code: 'SE', image: 'sweden' },
  { country: 'Switzerland', code: 'CH', image: 'switzerland' },
  { country: 'United Kingdom', code: 'GB', image: 'united-kingdom' },
  { country: 'United States', code: 'US', image: 'united-states-of-america' },
  { country: 'Italy', code: 'IT', image: 'italy' },
  { country: 'Portugal', code: 'PT', image: 'portugal' }
]

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
    classes: PropTypes.object.required,
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
              Please choose the country that you have your bank account to receive your bounties when conclude any task
            </DialogContentText>
            <div className={ classes.countryContainer }>
              { countryCodes.map((item) => {
                return (
                  <Button variant={ this.state.currentCountryCode === item.code ? 'outlined' : '' } onClick={ (e) => this.handleCountry(e, item) } className={ classes.countryItem }>
                    <img width='48' src={ require(`../../images/countries/${item.image}.png`) } />
                    <Typography component='span'>
                      { item.country }
                    </Typography>
                  </Button>
                )
              }) }
            </div>
          </DialogContent>
          <DialogActions>
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
            }) } size='large' color='primary' autoFocus>
              Choose { this.state.currentCountryLabel }
            </Button>
          </DialogActions>
          <DialogContent>
            <DialogContentText id='alert-dialog-footer'>
              <div>Icons made by <a href='http://www.freepik.com/' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/' title='Creative Commons BY 3.0' target='_blank'>CC 3.0 BY</a></div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(CountryPicker)
