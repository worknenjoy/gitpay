import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

type OsValue = 'Windows' | 'Linux' | 'Mac'
type OsValueSingle = OsValue | ''

type OsSwitcherProps =
  | {
      multiple?: false
      value?: OsValueSingle
      onChange: (value: OsValueSingle) => void
      size?: 'small' | 'medium' | 'large'
      allowEmpty?: boolean
    }
  | {
      multiple: true
      value?: OsValue[]
      onChange: (value: OsValue[]) => void
      size?: 'small' | 'medium' | 'large'
    }

const OsSwitcher = (props: OsSwitcherProps) => {
  const { size = 'medium' } = props
  const multiple = 'multiple' in props && props.multiple === true

  const commonSx = {
    bgcolor: 'action.hover',
    p: { xs: 0.25, sm: 0.5 },
    borderRadius: 999,
    gap: { xs: 0.5, sm: 0.75 },
    '& .MuiToggleButtonGroup-grouped': {
      border: 0,
      borderRadius: 999,
      textTransform: 'none',
      px: { xs: 1.25, sm: 1.75 },
      py: { xs: 0.5, sm: 0.75 },
      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
      lineHeight: 1.1
    },
    '& .MuiToggleButtonGroup-grouped.Mui-selected': {
      bgcolor: 'background.paper',
      boxShadow: 1
    }
  } as const

  if (multiple) {
    const value = (props.value ?? []) as OsValue[]

    return (
      <ToggleButtonGroup
        exclusive={false}
        size={size}
        value={value}
        onChange={(_, nextValue: OsValue[]) => props.onChange(nextValue)}
        aria-label="preferred os"
        sx={commonSx}
      >
        <ToggleButton value="Windows">Windows</ToggleButton>
        <ToggleButton value="Linux">Linux</ToggleButton>
        <ToggleButton value="Mac">Mac</ToggleButton>
      </ToggleButtonGroup>
    )
  }

  const { value = '', onChange, allowEmpty = false } = props

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      value={value}
      onChange={(_, nextValue: OsValue | null) => {
        if (nextValue === null && !allowEmpty) return
        onChange((nextValue ?? '') as unknown as OsValueSingle)
      }}
      aria-label="preferred os"
      sx={commonSx}
    >
      <ToggleButton value="Windows">Windows</ToggleButton>
      <ToggleButton value="Linux">Linux</ToggleButton>
      <ToggleButton value="Mac">Mac</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default OsSwitcher
