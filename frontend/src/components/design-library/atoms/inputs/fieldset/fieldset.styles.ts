import { styled } from '@mui/material/styles'

export const StyledFieldset = styled('fieldset')(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  margin: '16px 0',
}))

export const StyledLegend = styled('legend')(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.primary.dark,
}))

export const Placeholder = styled('div')(() => ({
  width: '95%',
  padding: 12,
}))

export default {
  StyledFieldset,
  StyledLegend,
  Placeholder,
}
