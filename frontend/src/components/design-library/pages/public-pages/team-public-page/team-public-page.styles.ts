import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField'

export const CoreTeamForm = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  marginRight: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  color: 'white'
}))

export const UnderlineTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.common.white}`
  },
  marginBottom: 16
}))
