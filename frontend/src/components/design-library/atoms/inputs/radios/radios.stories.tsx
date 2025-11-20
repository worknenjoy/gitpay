import React from 'react'
import Radios from './radios'

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
]

export default {
  title: 'Design Library/Atoms/Inputs/Radios',
  component: Radios
}

export const Default = {
  render: (args) => {
    return <Radios {...args} label="Example Radios" options={options} onChange={() => {}} />
  },
  args: {
    name: 'example-radios'
  }
}
