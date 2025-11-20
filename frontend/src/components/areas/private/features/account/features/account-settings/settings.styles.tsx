import { css, styled } from '@mui/material/styles'
import { Avatar, Typography } from '@mui/material'

import media from '../../../../../../../styleguide/media'

export const Title = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))

export const LabelButton = styled('span', {
  shouldForwardProp: (prop) => prop !== 'right'
})<{ right?: boolean }>`
  ${({ right }) =>
    right
      ? css`
          margin-left: 10px;
        `
      : css`
          margin-right: 10px;
        `}

  @media (min-width: 37.5em) {
    display: none;
    margin-right: 0;
  }

  @media (min-width: 64em) {
    display: block;
    margin-right: 10px;
  }
`

export const StyledAvatarIconOnly = styled(Avatar)`
  margin-left: 20px;
  cursor: pointer;
  align-items: center;
  ${media.phone`margin-left: 15px;`}

  @media(max-width: 37.5em) {
    margin-bottom: 20px !important;
  }
`
