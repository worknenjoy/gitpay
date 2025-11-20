import { styled } from '@mui/material/styles'
import { Paper as MuiPaper, Typography as MuiTypography, Link as MuiLink } from '@mui/material'

export const Container = styled(MuiPaper)(({ theme }) => ({
  background: '#F7F7F7',
  borderColor: '#F0F0F0',
  borderWidth: 1,
  borderStyle: 'solid',
  boxShadow: 'none',
  padding: 10,
  paddingTop: 0,
}))

export const Header = styled('div')({
  textAlign: 'center',
})

export const Row = styled('div')({
  display: 'flex',
  marginTop: 10,
  marginBottom: 10,
})

export const IconBox = styled('div')({
  width: 25,
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
})

export const Content = styled('div')({
  paddingLeft: 5,
})

export const GrayCaption = styled(MuiTypography)({
  color: 'gray',
})

export const DeliveryDateSuggestion = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingLeft: 5,
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

export const DateSuggestionBtn = styled(MuiLink)(({ theme }) => ({
  cursor: 'pointer',
  [theme.breakpoints.up('sm')]: {
    marginTop: 4,
    marginLeft: 10,
  },
}))

export const SpanText = styled('span')({
  color: 'gray',
})
