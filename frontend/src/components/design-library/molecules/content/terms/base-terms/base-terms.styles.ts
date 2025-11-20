import { styled } from '@mui/material/styles'
import { Paper, Button } from '@mui/material'

type TermsContainerProps = {
  extraStyles?: boolean
}

export const TermsContainer = styled('div')<TermsContainerProps>(({ extraStyles }) => ({
  ...(extraStyles
    ? {
        padding: 20,
        textAlign: 'left',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: 'white'
      }
    : {})
}))

export const Header = styled('div')({
  marginBottom: 10
})

export const ContentArea = styled('div')({
  overflow: 'scroll',
  height: 'calc(100vh - 200px)'
})

export const ActionsBar = styled(Paper)({
  position: 'absolute',
  bottom: 20,
  left: 0,
  height: 80,
  width: '100%',
  background: 'white'
})

export const ActionButton = styled(Button)({
  float: 'right',
  marginRight: 20,
  marginTop: 20
})
