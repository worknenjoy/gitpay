import React from 'react'
import { FormControl, Input, InputLabel, FormHelperText, Skeleton } from '@mui/material'
import { FormattedMessage } from 'react-intl'

type FieldProps = {
  name: string,
  label: string | React.ReactNode,
  type?: string,
  required?: boolean,
  defaultValue?: string,
  value?: string,
  completed?: boolean,
  error?: boolean,
  min?: number,
  max?: number,
  placeholder?: string,
  disabled?: boolean,
  help?: boolean,
  inputComponent?: any,
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
  endAdornment?: React.ReactNode,
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Field = React.forwardRef<HTMLElement, FieldProps>((
  { name, value, label, completed = true, error, type = 'text', min, max, required = false, defaultValue, placeholder, disabled, help, inputComponent, inputProps, endAdornment, onChange },
  ref
) => {
  return (
    <FormControl style={{ width: '100%' }}>
      {
        !completed ? (
          <Skeleton variant="text" animation="wave" width="100%" style={{ margin: '20px 0' }} />
        ) : (
          <>
            <InputLabel htmlFor={name}>
              {label}
            </InputLabel>
            <Input
              inputRef={ref}
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
              error={error}
              inputProps={{...inputProps, ...(type === 'number' ? { min, max } : {})}}
            />
            {help &&
              <FormHelperText id="component-helper-text">
                <FormattedMessage id="validation-message" defaultMessage="+Country code and Number" />
              </FormHelperText>
            }
          </>
        )
      }
    </FormControl>
  )
})

export default Field