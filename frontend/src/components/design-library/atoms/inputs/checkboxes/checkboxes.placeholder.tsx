import React from 'react'
import { Grid, Skeleton } from '@mui/material'
import { CheckboxesContainer, CheckboxItem } from './checkboxes.styles'

type CheckboxesPlaceholderProps = {
  items?: number
}

const CheckboxesPlaceholder: React.FC<CheckboxesPlaceholderProps> = ({ items = 3 }) => {
  const placeholders = Array.from({ length: items })

  return (
    <CheckboxesContainer>
      <Grid container spacing={3}>
        {placeholders.map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 12 / items }}>
            <CheckboxItem>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton variant="rectangular" width={18} height={18} />
                <Skeleton variant="text" width="60%" />
              </div>
            </CheckboxItem>
          </Grid>
        ))}
      </Grid>
    </CheckboxesContainer>
  )
}

export default CheckboxesPlaceholder
