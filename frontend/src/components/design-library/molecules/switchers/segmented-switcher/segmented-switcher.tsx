import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useIntl } from 'react-intl'

export type SegmentedSwitcherOption = {
  value: string
  label: React.ReactNode
}

export type SegmentedSwitcherProps = {
  options: SegmentedSwitcherOption[]
  value: string
  onChange: (value: string) => void
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
}

const SegmentedSwitcher = ({
  options,
  value,
  onChange,
  size = 'medium',
  ariaLabel
}: SegmentedSwitcherProps) => {
  const intl = useIntl()

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      value={value}
      onChange={(_, nextValue: string | null) => {
        if (nextValue === null) return
        onChange(nextValue)
      }}
      aria-label={
        ariaLabel ??
        intl.formatMessage({
          id: 'design-library.segmentedSwitcher.ariaLabel',
          defaultMessage: 'Switch view'
        })
      }
      sx={{
        bgcolor: 'action.hover',
        p: 0.5,
        borderRadius: 999,
        gap: 0.5,
        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          borderRadius: 999,
          textTransform: 'none',
          px: 2,
          py: 0.75,
          fontSize: '0.8125rem'
        },
        '& .MuiToggleButtonGroup-grouped.Mui-selected': {
          bgcolor: 'background.paper',
          boxShadow: 1
        }
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default SegmentedSwitcher
