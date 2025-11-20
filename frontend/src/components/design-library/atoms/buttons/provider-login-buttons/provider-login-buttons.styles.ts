import { styled } from '@mui/material/styles'

export const ButtonWithMargin = styled('span')(() => ({
  marginRight: 10
}))

export const TextMargin = styled('span')(() => ({
  marginLeft: 10
}))

export const LinkMargin = styled('a')(() => ({
  display: 'inline-box',
  marginLeft: 5
}))

export default { ButtonWithMargin, TextMargin, LinkMargin }
