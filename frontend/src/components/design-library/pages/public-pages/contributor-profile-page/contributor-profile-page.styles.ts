import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Grid)(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginBottom: theme.spacing(3)
}))

export const SwitcherRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}))

export const SkillsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1)
}))

export const SubTabsRow = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2)
}))
