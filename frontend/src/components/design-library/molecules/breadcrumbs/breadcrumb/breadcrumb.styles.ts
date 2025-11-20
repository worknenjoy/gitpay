import { styled } from '@mui/material/styles'

export const BreadcrumbRoot = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))

export const BreadcrumbLink = styled('span')(() => ({
  textDecoration: 'underline'
}))

export default { BreadcrumbRoot, BreadcrumbLink }
