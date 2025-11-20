import React from 'react'
import CountryPickerDialog from './country-picker-dialog'

export default {
  title: 'Design Library/Molecules/Dialogs/CountryPickerDialog',
  component: CountryPickerDialog
}

const Template = (args) => <CountryPickerDialog {...args} />

export const Default = Template.bind({})
Default.args = {
  open: true,
  onClose: (e, country) => {
    console.log('Dialog closed', e, country)
  }
}
