import { Theme } from '@mui/material/styles'

export const getCheckboxesStyles = (theme: Theme) => ({
  container: {
    fontFamily: 'Roboto',
    color: '#a9a9a9'
  },
  item: {
    paddingBottom: 0
  },
  checkbox: {
    paddingRight: 5
  }
})

export default getCheckboxesStyles
