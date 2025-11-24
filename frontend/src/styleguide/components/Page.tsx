import { styled } from '@mui/material/styles'

export const PageContent = styled('div')(({ theme }) => ({
  padding: '0 0 0 0'
}))

export const Page = styled('div')({
  overflowX: 'hidden'
})

export const PageContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column'
  }
}))
