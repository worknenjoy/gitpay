import { styled } from '@mui/material/styles'
import { Divider } from '@mui/material'

export const Container = styled('div')(({ theme }) => ({
  textAlign: 'left',
  padding: 80,
  paddingTop: 40,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    padding: '25px 10px 5px 10px',
    '& a': {
      textAlign: 'center'
    }
  }
}))

export const BaseFooter = styled('div')({
  paddingTop: 0
})

export const SubscribeFromWrapper = styled('div')(({ theme }) => ({
  marginTop: '1rem',
  marginBottom: '1rem',
  [theme.breakpoints.down('sm')]: {
    input: {
      display: 'block',
      margin: '0 auto 1rem auto',
      width: '100% !important',
      textAlign: 'center'
    }
  }
}))

export const SecBlock = styled('div')(() => ({
  textAlign: 'center',
  padding: 8,
  backgroundColor: '#f1f0ea'
}))

export const SpacedDivider = styled(Divider)(() => ({
  marginTop: 20
}))

export const LogoImg = styled('img')(() => ({
  verticalAlign: 'middle'
}))
