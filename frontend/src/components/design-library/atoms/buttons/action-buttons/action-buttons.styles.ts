import { styled } from '@mui/material/styles'

const useStyles = styled(() => ({
  primaryWrapper: {
    marginTop: 30,
    marginBottom: 10
  },
  primaryLabel: {
    display: 'inline-block',
    marginRight: 10
  },
  secondaryContainer: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  secondaryButton: {
    marginRight: 5
  },
  secondaryLabel: {
    display: 'inline-block',
    marginRight: 10
  }
}))

export default useStyles
