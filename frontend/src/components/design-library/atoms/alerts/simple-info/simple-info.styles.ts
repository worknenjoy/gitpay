import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  iconCenter: {
    verticalAlign: 'middle',
    paddingRight: 5,
    color: 'action',
  },
  text: {
    color: 'gray',
    marginTop: 5,
    fontSize: 11,
  },
}))

export default useStyles
