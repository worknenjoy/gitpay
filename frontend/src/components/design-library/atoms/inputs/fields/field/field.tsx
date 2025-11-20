import React from 'react'
import { TextField, Skeleton } from '@mui/material'
import { RootFormControl } from './field.styles'
import { FormattedMessage } from 'react-intl'

type FieldProps = {
  name: string
  label: string | React.ReactNode
  type?: string
  required?: boolean
  defaultValue?: string | number
  value?: string | number
  completed?: boolean
  error?: boolean
  min?: number
  max?: number
  placeholder?: string
  disabled?: boolean
  help?: boolean
  inputComponent?: any
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  endAdornment?: React.ReactNode
  ref?: React.Ref<HTMLElement> | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Field = React.forwardRef<HTMLElement, FieldProps>(
  (
    {
      name,
      value,
      label,
      completed = true,
      error,
      type = 'text',
      min,
      max,
      required = false,
      defaultValue,
      placeholder,
      disabled,
      help,
      inputComponent,
      inputProps,
      endAdornment,
      onChange,
    },
    ref,
  ) => {
    return (
      <RootFormControl>
        {!completed ? (
          <Skeleton variant="text" animation="wave" width="100%" sx={{ my: 2 }} />
        ) : (
          <TextField
            inputRef={ref}
            id={name}
            name={name}
            type={type}
            required={required}
            defaultValue={defaultValue}
            value={value}
            fullWidth
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            error={error}
            label={label}
            variant="standard"
            InputLabelProps={{
              // Force shrink only when there's content; otherwise let MUI handle focus-based shrink
              ...(inputComponent && (Boolean(value) || Boolean(defaultValue))
                ? { shrink: true }
                : {}),
            }}
            helperText={
              help ? (
                <FormattedMessage
                  id="validation-message"
                  defaultMessage="+Country code and Number"
                />
              ) : undefined
            }
            InputProps={{
              ...(inputComponent ? { inputComponent } : {}),
              ...(endAdornment ? { endAdornment } : {}),
            }}
            inputProps={{
              ...inputProps,
              ...(type === 'number' ? { min, max } : {}),
            }}
          />
        )}
      </RootFormControl>
    )
  },
)

export default Field
