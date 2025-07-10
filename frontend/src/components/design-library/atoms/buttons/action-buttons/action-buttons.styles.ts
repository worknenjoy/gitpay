import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
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
