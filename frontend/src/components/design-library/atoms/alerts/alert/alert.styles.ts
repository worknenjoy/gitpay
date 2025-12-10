import { styled } from '@mui/material/styles'
import { Alert } from '@mui/material'

export const CustomAlertStyled = styled(Alert)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))
