import { styled } from '@mui/material/styles'

// Styled wrapper for inline text used inside FormattedMessage render props
export const SpanText = styled('span')(({ theme }) => ({
  display: 'inline-block',
  verticalAlign: 'middle',
}))
