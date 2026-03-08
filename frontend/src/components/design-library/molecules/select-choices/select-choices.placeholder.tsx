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
}

const SelectChoicesPlaceholder: React.FC<SelectChoicesPlaceholderProps> = ({
  count = 3,
  itemSize = { xs: 12, sm: 6, md: 3 }
}) => {
  const placeholders = Array.from({ length: count })

  return (
    <>
      {placeholders.map((_, index) => (
        <SelectChoicesItem key={index} size={itemSize}>
          <SelectChoicesCard variant="outlined">
            <SelectChoicesMedia>
              <Skeleton variant="rectangular" width="100%" height={96} animation="wave" />
            </SelectChoicesMedia>
            <SelectChoicesLabel>
              <Typography variant="subtitle1">
                <Skeleton variant="text" width="70%" animation="wave" />
              </Typography>
            </SelectChoicesLabel>
            <SelectChoicesActionBar>
              <Typography variant="body2" component="p">
                <Skeleton variant="text" width="100%" animation="wave" />
              </Typography>
              <Skeleton variant="circular" width={36} height={36} animation="wave" />
            </SelectChoicesActionBar>
          </SelectChoicesCard>
        </SelectChoicesItem>
      ))}
    </>
  )
}

export default SelectChoicesPlaceholder
