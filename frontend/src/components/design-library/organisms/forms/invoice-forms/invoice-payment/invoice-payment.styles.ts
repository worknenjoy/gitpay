import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

export const InfoAlertWrapper = styled('div')(({ theme }) => ({
  marginTop: 10,
  marginBottom: 10
}))

export const StyledPayButton = styled(Button)(({ theme }) => ({
  float: 'right',
  marginTop: 10
}))
