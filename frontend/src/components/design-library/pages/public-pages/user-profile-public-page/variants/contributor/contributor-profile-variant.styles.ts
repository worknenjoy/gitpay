import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Shell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(10)
}))

export const SwitcherRow = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '28px 0'
})
