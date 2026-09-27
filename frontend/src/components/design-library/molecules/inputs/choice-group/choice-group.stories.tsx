import React from 'react'
import type { Meta } from '@storybook/react'
import ChoiceGroup, { ChoiceGroupProps } from './choice-group'

const meta: Meta<typeof ChoiceGroup> = {
  title: 'Design Library/Molecules/Inputs/ChoiceGroup',
  component: ChoiceGroup,
  parameters: { layout: 'padded' }
}

export default meta

const amountModeOptions = [
  {
    value: 'fixed',
    title: 'Fixed amount',
    description: 'You set the price. The payer pays that amount.'
  },
  { value: 'custom', title: 'Custom amount', description: 'The payer chooses how much to pay.' }
]

const StatefulChoiceGroup = (args: ChoiceGroupProps) => {
  const [value, setValue] = React.useState(args.value)
  return <ChoiceGroup {...args} value={value} onChange={setValue} />
}

export const Default = {
  render: StatefulChoiceGroup,
  args: {
    options: amountModeOptions,
    value: 'fixed'
  }
}

export const ThreeOptions = {
  render: StatefulChoiceGroup,
  args: {
    options: [
      {
        value: 'work',
        title: 'Payment for agreed work',
        description: 'The payer owes this amount for delivered work.'
      },
      {
        value: 'support',
        title: 'Voluntary support',
        description: 'Anyone can support this contribution.'
      },
      { value: 'other', title: 'Other', description: 'Something else entirely.', disabled: true }
    ],
    value: 'work'
  }
}

export const WithDisabledOption = {
  render: StatefulChoiceGroup,
  args: {
    options: [amountModeOptions[0], { ...amountModeOptions[1], disabled: true }],
    value: 'fixed'
  }
}
