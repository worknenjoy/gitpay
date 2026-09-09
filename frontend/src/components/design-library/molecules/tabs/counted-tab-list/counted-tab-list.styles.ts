import { Tab } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

export const StyledTab = styled(Tab)(({ theme }) => ({
  '& .count': {
    color: theme.palette.text.disabled
  },
  '&.Mui-selected .count': {
    color: alpha(theme.palette.secondary.main, 0.6)
  }
}))
