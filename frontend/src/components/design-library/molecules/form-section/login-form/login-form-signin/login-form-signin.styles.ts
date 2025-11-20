import { Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Margins = styled('div')(({ theme }) => ({
  marginBottom: 20
}))

export const Center = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center'
}))

export const SpacedButton = styled(Button)(({ theme }) => ({
  marginTop: 10
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main
  }
}))
