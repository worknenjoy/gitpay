import { styled } from '@mui/material/styles'
import { MenuItem } from '@mui/material'

export const MenuItemCustom = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))
