import { styled } from '@mui/material/styles'
import { Avatar } from '@mui/material'

export type AvatarStackSize = 'sm' | 'md' | 'lg'

export const SIZES: Record<AvatarStackSize, { box: number; font: number; overlap: number }> = {
  sm: { box: 20, font: 10, overlap: 6 },
  md: { box: 28, font: 12, overlap: 8 },
  lg: { box: 36, font: 14, overlap: 10 }
}

// Stable, muted brand-adjacent colors for initials, picked by name.
export const AVATAR_COLORS = ['#407E6F', '#DD854C', '#6b7a8f', '#2c5c46', '#8a6d3b', '#7b5ea7']
export const ANONYMOUS_COLOR = '#bdbdbd'

export const Stack = styled('span')({
  display: 'inline-flex',
  alignItems: 'center'
})

export const StackAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'bg' && prop !== 'first'
})<{ size: AvatarStackSize; bg?: string; first?: boolean }>(({ theme, size, bg, first }) => ({
  width: SIZES[size].box,
  height: SIZES[size].box,
  fontSize: SIZES[size].font,
  fontWeight: 500,
  color: '#fff',
  backgroundColor: bg,
  border: size === 'sm' ? 0 : `2px solid ${theme.palette.background.paper}`,
  boxSizing: 'border-box',
  marginLeft: first ? 0 : -SIZES[size].overlap,
  boxShadow: size === 'sm' && !first ? `0 0 0 2px ${theme.palette.background.paper}` : 'none'
}))
