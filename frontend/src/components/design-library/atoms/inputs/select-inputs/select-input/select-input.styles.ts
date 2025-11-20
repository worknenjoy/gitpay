import { styled } from '@mui/material/styles'
import { FormControl, Select as MuiSelect, MenuItem as MuiMenuItem } from '@mui/material'

export const RootFormControl = styled(FormControl)(({ theme }) => ({
  margin: '10px 0',
  width: '100%',
}))

export const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  width: '100%',
  // control the displayed area padding
  '& .MuiSelect-select': {
    paddingTop: 8,
    paddingBottom: 8,
  },
  // control the input height/padding within the select
  '& .MuiInputBase-input': {
    height: 130,
    boxSizing: 'border-box',
    padding: 10,
  },
}))

export const StyledMenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: 10,
  height: 30,
}))
