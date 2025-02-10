import React from 'react'
import { FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

type FieldProps = {
  name: string,
  label: string | React.ReactNode,
  type?: string,
  required?: boolean,
  defaultValue?: string,
  value?: string,
  placeholder?: string,
  disabled?: boolean,
  help?: boolean,
  inputComponent?: any,
  endAdornment?: React.ReactNode,
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Field = ({ ref, name, value, label, type = 'text', required = false, defaultValue, placeholder, disabled, help, inputComponent, endAdornment, onChange }: FieldProps) => {
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel
        htmlFor={name}
      >
        {label}
      </InputLabel>
      <Input
        ref={ref}
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        value={value}
        fullWidth
        style={{ width: '100%' }}
        placeholder={placeholder}
        disabled={disabled}
        inputComponent={inputComponent}
        onChange={onChange}
        endAdornment={endAdornment}
      />
      {help &&
        <FormHelperText id='component-helper-text'>
          <FormattedMessage id='validation-message' defaultMessage='+Country code and Number' />
        </FormHelperText>
      }
    </FormControl>
  )
}

export default Field