import React from 'react'
import { Chip, Box } from '@mui/material'

export type AvailabilityChipProps = {
  label: React.ReactNode
  active?: boolean
}

const AvailabilityChip = ({ label, active = false }: AvailabilityChipProps) => (
  <Chip
    size="small"
    variant="outlined"
    icon={
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: active ? 'primary.main' : 'warning.main'
        }}
      />
    }
    label={label}
    sx={{
      fontSize: 11,
      color: 'text.secondary',
      borderColor: 'divider',
      '& .MuiChip-icon': { ml: '10px', mr: '-2px' }
    }}
  />
)

export default AvailabilityChip
