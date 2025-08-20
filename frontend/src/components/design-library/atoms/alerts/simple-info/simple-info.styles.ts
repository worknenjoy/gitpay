import { styled } from '@mui/material/styles'

const useStyles = styled(() => ({
  root: {
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center'
  },
  iconCenter: {
    verticalAlign: 'middle',
    paddingRight: 5,
    color: 'action'
  },
  text: {
    color: 'gray',
    marginTop: 5,
    fontSize: 11
  }
}))

export default useStyles
