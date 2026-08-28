import React from 'react'
import { Skeleton, Typography } from '@mui/material'

import {
  SelectChoicesItem,
  SelectChoicesCard,
  SelectChoicesMedia,
  SelectChoicesLabel,
  SelectChoicesActionBar
} from './select-choices.styles'

type SelectChoicesPlaceholderProps = {
  count?: number
  itemSize?: { xs?: number; sm?: number; md?: number; lg?: number }
  compact?: boolean
}

const SelectChoicesPlaceholder: React.FC<SelectChoicesPlaceholderProps> = ({
  count = 3,
  itemSize = { xs: 12, sm: 6, md: 3 },
  compact = false
}) => {
  const placeholders = Array.from({ length: count })
  const mediaHeight = compact ? 76 : 160
  const checkboxSize = compact ? 24 : 36

  return (
    <>
      {placeholders.map((_, index) => (
        <SelectChoicesItem key={index} size={itemSize}>
          <SelectChoicesCard variant="outlined">
            <SelectChoicesMedia compact={compact}>
              <Skeleton variant="rectangular" width="100%" height={mediaHeight} animation="wave" />
            </SelectChoicesMedia>
            <SelectChoicesLabel compact={compact}>
              <Typography variant="subtitle1">
                <Skeleton variant="text" width="70%" animation="wave" />
              </Typography>
            </SelectChoicesLabel>
            <SelectChoicesActionBar compact={compact}>
              {!compact && (
                <Typography variant="body2" component="p">
                  <Skeleton variant="text" width="100%" animation="wave" />
                </Typography>
              )}
              <Skeleton
                variant="circular"
                width={checkboxSize}
                height={checkboxSize}
                animation="wave"
              />
            </SelectChoicesActionBar>
          </SelectChoicesCard>
        </SelectChoicesItem>
      ))}
    </>
  )
}

export default SelectChoicesPlaceholder
