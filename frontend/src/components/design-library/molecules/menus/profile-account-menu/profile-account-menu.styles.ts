import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

interface ProfileAvatarProps {
  bgColor?: string
  iconColor?: string
}

export const ProfileAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'iconColor'
})<ProfileAvatarProps>(({ theme, bgColor, iconColor }) => ({
  backgroundColor: bgColor || theme.palette.grey[200],
  color: iconColor || theme.palette.primary.main,
  width: 32,
  height: 32,
  fontSize: 12
}))
