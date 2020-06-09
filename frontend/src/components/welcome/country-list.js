import React, { Component } from 'react'

// note that you can also export the source data via CountryRegionData. It's in a deliberately concise format to
// keep file size down
import { CountryDropdown } from 'react-country-region-selector'

export default class CountryList extends Component {
  constructor (props) {
    super(props)
    this.state = { country: 'Select Country' }
  }

  selectCountry (val) {
    this.setState({ country: val })
  }

  render () {
    const { country } = this.state
    return (
      <div>
        <CountryDropdown
          style={ {
            width: '100%',
            height: '60px',
            borderRadius: 6,
            border: '1px solid #ccc',
            paddingLeft: 10,
            paddingRight: 10
          } }
          name={'country'}
          value={ country }
          onChange={ (val) => this.selectCountry(val) } />
      </div>
    )
  }
}
