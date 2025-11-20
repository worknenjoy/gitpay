import { Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'
import media from '../../../../../styleguide/media'

export const StyledAvatarIconOnly = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;
  align-items: center;
  ${media.phone`margin-left: 15px;`}

  @media(max-width: 37.5em) {
    margin-bottom: 20px !important;
  }
`
