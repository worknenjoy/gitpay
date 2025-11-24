import { Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column'
}))

export const ChipContainer = styled('div')(({ theme }) => ({
  marginTop: 12,
  marginBottom: 12,
  width: '100%'
}))

export const SpacedChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))
