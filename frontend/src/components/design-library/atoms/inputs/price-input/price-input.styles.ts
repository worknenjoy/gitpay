import { Theme } from '@mui/material/styles'

export const getPriceInputStyles = (theme: Theme) => ({
  formPayment: {
    marginTop: 10,
    marginBottom: 10
  },
  currencySymbol: {
    fontSize: 28
  },
  input: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'right',
    height: 98
  }
})

export default getPriceInputStyles
