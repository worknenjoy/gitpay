import { css, styled } from '@mui/material/styles'
import Button, { ButtonProps } from '../button/button'

export const SigninButtonsStyled = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    'a, button': {
      fontSize: 21,
      marginBottom: 20,
      marginRight: 0,
      marginLeft: 0,
      padding: 0
    }
  }
}))

export const StyledButton = styled(Button)<ButtonProps>`
  min-width: 20px !important;
  font-size: 12px;
  cursor: pointer;
  margin-left: 10px !important;

  @media (max-width: 37.5em) {
    margin-bottom: 20px !important;
    margin-left: 0 !important;
    font-size: 28px;
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
