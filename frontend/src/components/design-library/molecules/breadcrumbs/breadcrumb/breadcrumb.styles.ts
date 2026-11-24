import { styled } from '@mui/material/styles'

export const BreadcrumbRoot = styled('div')(({ theme }) => ({
  // No top margin: the breadcrumb is the first thing on a page, and the page
  // container already provides the top spacing, so it lines up with side panels.
  marginBottom: theme.spacing(2)
}))

export const BreadcrumbLink = styled('span')(() => ({
  textDecoration: 'underline'
}))

export default { BreadcrumbRoot, BreadcrumbLink }
