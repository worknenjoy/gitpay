import type { CSSProperties } from 'react'
import { styled } from '@mui/material/styles'
import { Checkbox, FormControlLabel } from '@mui/material'

export const CheckboxesContainer = styled('div')(({ theme }) => ({
  color: '#a9a9a9'
}))

export const CheckboxItem = styled('div')(({ theme }) => ({
  paddingBottom: 0
}))

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingRight: 5
}))

type StyledFormControlLabelProps = {
  alignment?: CSSProperties['alignItems']
}

export const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'alignment'
})<StyledFormControlLabelProps>(({ theme, alignment }) => ({
  alignItems: alignment ?? 'center',
  marginLeft: 0,
  marginRight: 0,
  '.MuiFormControlLabel-label': {
    lineHeight: 1.25
  }
}))
