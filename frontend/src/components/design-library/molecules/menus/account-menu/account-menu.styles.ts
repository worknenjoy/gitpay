import { Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'
import media from '../../../../../styleguide/media'

export const StyledAvatar = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;

  ${media.phone`margin-left: 15px;`}
`
