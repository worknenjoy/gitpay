import { styled } from '@mui/material/styles'
import Button from '../../../../atoms/buttons/button/button'

export const InfoAlertWrapper = styled('div')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10,
  '& .MuiButton-root': {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textWrap: 'auto',
      textAlign: 'center'
    }
  }
}))

export const StyledPayButton = styled(Button)(({ theme }) => ({
  float: 'right',
  marginTop: 10
}))
