import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingRight: 5,
}))

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  paddingTop: 0,
}))
