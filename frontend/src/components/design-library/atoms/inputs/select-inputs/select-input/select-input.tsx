import React from 'react'
import { Skeleton } from '@mui/material'
import { RootFormControl, StyledSelect, StyledMenuItem } from './select-input.styles'

const SelectInput = ({ options, value, onChange, completed = true }) => {
  return completed ? (
    <RootFormControl variant="standard" size="medium">
      <StyledSelect
        value={value}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 400 }
          }
        }}
      >
        {options.map((option) => (
          <StyledMenuItem key={option.value} value={option.value} selected={option.value === value}>
            {option.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </RootFormControl>
  ) : (
    <Skeleton variant="rectangular" width="100%" height={56} animation="wave" />
  )
}

export default SelectInput
