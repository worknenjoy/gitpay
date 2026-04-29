import { styled } from '@mui/material/styles'
import { Chip as MuiChip, Avatar as MuiAvatar } from '@mui/material'

export const ChipStatusSuccess = styled(MuiChip)(({ theme }) => ({
  height: 'auto',
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  border: 'none',
  '& .MuiChip-label': { paddingLeft: 4, paddingRight: 0 },
  '& .MuiChip-avatar': { marginLeft: 0 }
}))

export const ChipStatusClosed = styled(MuiChip)(({ theme }) => ({
  height: 'auto',
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  color: theme.palette.error.main,
  border: 'none',
  '& .MuiChip-label': { paddingLeft: 4, paddingRight: 0 },
  '& .MuiChip-avatar': { marginLeft: 0 }
}))

export const AvatarStatusSuccess = styled(MuiAvatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main
}))

export const AvatarStatusClosed = styled(MuiAvatar)(({ theme }) => ({
  backgroundColor: theme.palette.error.main
}))

export default { ChipStatusClosed, ChipStatusSuccess, AvatarStatusClosed, AvatarStatusSuccess }
