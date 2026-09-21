import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useIntl } from 'react-intl'

export type SegmentedSwitcherOption = {
  value: string
  label: React.ReactNode
}

export type SegmentedSwitcherVariant = 'default' | 'transparent'

export type SegmentedSwitcherProps = {
  options: SegmentedSwitcherOption[]
  value: string
  onChange: (value: string) => void
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
  /** 'default' (existing look): one filled pill-shaped container, the active
   * option gets a white background + shadow. 'transparent': each option is
   * its own outlined pill sitting directly on the page background, and the
   * active one fills with the primary color — matches the role switcher in
   * the multi-role ("Combined") dashboard design. */
  variant?: SegmentedSwitcherVariant
}

const SegmentedSwitcher = ({
  options,
  value,
  onChange,
  size = 'medium',
  ariaLabel,
  variant = 'default'
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
      sx={
        variant === 'transparent'
          ? {
              gap: 1,
              flexWrap: 'wrap',
              '& .MuiToggleButtonGroup-grouped': {
                border: '1px solid !important',
                borderColor: 'divider',
                borderRadius: '999px !important',
                marginLeft: '0 !important',
                textTransform: 'none',
                height: 30,
                px: 1.75,
                gap: 0.75,
                fontSize: '0.8125rem',
                color: 'text.secondary',
                bgcolor: 'background.paper'
              },
              '& .MuiToggleButtonGroup-grouped:hover': {
                borderColor: 'text.secondary',
                color: 'text.primary',
                bgcolor: 'background.paper'
              },
              '& .MuiToggleButtonGroup-grouped.Mui-selected': {
                bgcolor: 'primary.main',
                borderColor: 'primary.main',
                color: 'primary.contrastText'
              },
              '& .MuiToggleButtonGroup-grouped.Mui-selected:hover': {
                bgcolor: 'primary.main',
                borderColor: 'primary.main'
              }
            }
          : {
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
            }
      }
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
