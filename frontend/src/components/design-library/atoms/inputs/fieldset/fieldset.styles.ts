import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  legend: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.palette.primary.dark
  },
  fieldset: {
    border: `1px solid ${theme.palette.primary.light}`,
    margin: '16px 0'
  },
  placeholder: {
    width: '95%',
    padding: 12
  }
}))

export default useStyles
