import { styled } from '@mui/material/styles'
import { Chip as MuiChip, Avatar as MuiAvatar } from '@mui/material'

export const ChipStatusSuccess = styled(MuiChip)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main
}))

export const ChipStatusClosed = styled(MuiChip)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.error.main
}))

export const AvatarStatusSuccess = styled(MuiAvatar)(({ theme }) => ({
  width: theme.spacing(0),
  height: theme.spacing(0),
  backgroundColor: theme.palette.primary.main
}))

export const AvatarStatusClosed = styled(MuiAvatar)(({ theme }) => ({
  width: theme.spacing(0),
  height: theme.spacing(0),
  backgroundColor: theme.palette.error.main
}))

export default { ChipStatusClosed, ChipStatusSuccess, AvatarStatusClosed, AvatarStatusSuccess }
