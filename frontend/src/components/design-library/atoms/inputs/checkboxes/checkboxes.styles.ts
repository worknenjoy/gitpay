import { styled } from '@mui/material/styles'
import MuiCheckbox from '@mui/material/Checkbox'

export const CheckboxesContainer = styled('div')(({ theme }) => ({
  color: '#a9a9a9'
}))

export const CheckboxItem = styled('div')(({ theme }) => ({
  paddingBottom: 0
}))

export const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  paddingRight: 5
}))
