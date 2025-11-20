import { styled } from '@mui/material/styles'

export const StyledFieldset = styled('fieldset')(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  marginBottom: 20,
  '&[disabled] legend': {
    color: theme.palette.primary.light,
  },
}))

export const StyledLegend = styled('legend')(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.primary.dark,
}))

export default {
  StyledFieldset,
  StyledLegend,
}
