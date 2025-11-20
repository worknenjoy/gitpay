import { styled } from '@mui/material/styles'
import { FormControlLabel as MuiFormControlLabel, Box as MuiBox } from '@mui/material'

export const RowFormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  margin: '4px 0',
  display: 'flex',
  alignItems: 'flex-start',
}))

export const ContentBox = styled(MuiBox)(({ theme }) => ({
  marginTop: 10,
}))
