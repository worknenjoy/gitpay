import { styled } from '@mui/material/styles'
import { Avatar } from '@mui/material'

// Styled Avatar for the Skill component
export const SkillAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'greyed',
})<{ greyed?: boolean }>(({ theme, greyed }) => ({
  borderRadius: 0,
  backgroundColor: 'transparent',
  ...(greyed && {
    filter: 'grayscale(0.8)',
  }),
}))
