import { styled } from '@mui/material/styles'

export const Details = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column'
}))

export const SpanText = styled('span')(() => ({
  display: 'inline-block',
  verticalAlign: 'middle'
}))

export default { Details, SpanText }
