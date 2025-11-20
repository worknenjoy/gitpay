import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'

export const Root = styled(List)(({ theme }) => ({ width: '100%' }))
export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}))
