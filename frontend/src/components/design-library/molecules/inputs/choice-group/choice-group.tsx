import React from 'react'
import { Grid, OptionCard, OptionTitle, OptionDescription } from './choice-group.styles'

export type ChoiceGroupOption = {
  value: string
  title: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export type ChoiceGroupProps = {
  options: ChoiceGroupOption[]
  value: string
  onChange: (value: string) => void
}

const ChoiceGroup = ({ options, value, onChange }: ChoiceGroupProps) => (
  <Grid role="radiogroup">
    {options.map((option) => (
      <OptionCard
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        data-selected={value === option.value}
        disabled={option.disabled}
        onClick={() => onChange(option.value)}
      >
        <OptionTitle>{option.title}</OptionTitle>
        {option.description && <OptionDescription>{option.description}</OptionDescription>}
      </OptionCard>
    ))}
  </Grid>
)

export default ChoiceGroup
