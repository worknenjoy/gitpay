import { css, styled } from '@mui/material/styles'
import Button, { ButtonProps } from '../button/button'

export const StyledButton = styled(Button)<ButtonProps>`
  min-width: 20px !important;
  font-size: 12px;
  cursor: pointer;
  margin-left: 10px !important;

  @media (max-width: 37.5em) {
    margin-bottom: 20px !important;
  }
`

export const LinkButton = styled(StyledButton)`
  color: #fff !important;
`

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
