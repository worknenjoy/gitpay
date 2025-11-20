import React from 'react'
import { Typography, Skeleton } from '@mui/material'
import { StyledFieldset, StyledLegend } from './fieldset.styles'

const Fieldset = ({ children, completed, legend }) => {
  return (
    <StyledFieldset>
      <StyledLegend>
        <Typography>{legend}</Typography>
      </StyledLegend>
      {!completed ? <Skeleton variant="text" animation="wave" width="100%" /> : children}
    </StyledFieldset>
  )
}

export default Fieldset
