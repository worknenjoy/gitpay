import { styled } from '@mui/material/styles'
import { Checkbox } from '@mui/material'

export const CheckboxesContainer = styled('div')(({ theme }) => ({
  color: '#a9a9a9',
}))

export const CheckboxItem = styled('div')(({ theme }) => ({
  paddingBottom: 0,
}))

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingRight: 5,
}))
