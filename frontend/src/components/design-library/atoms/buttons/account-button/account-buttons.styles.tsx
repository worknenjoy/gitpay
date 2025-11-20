import { styled } from '@mui/material/styles'
import media from '../../../../../styleguide/media'
import { Avatar, Button } from '@mui/material'

export const StyledAvatar = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;

  ${media.phone`margin-left: 15px;`}
`

export const StyledButton = styled(Button)`
  min-width: 20px !important;
  font-size: 12px;
  cursor: pointer;
  margin-left: 10px !important;
`
